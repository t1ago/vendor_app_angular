import { Component, computed, inject, Signal } from '@angular/core';
import { BaseList } from '@shared/classes/base-list';
import { PageLoading } from '@shared/components/page-loading/page-loading';
import { PageLoadingService } from '@shared/components/page-loading/services/page-loading-service';
import { SHOW_ALWAYS } from '@shared/components/table/constants/table-constants';
import { ITableConfig } from '@shared/components/table/interfaces/table-config';
import { Table } from '@shared/components/table/table';
import { ToastService } from '@shared/components/toast/services/toast-service';
import { IMAGES } from '@shared/constants/images';
import { loadingObservablePipe } from '@shared/observable-pipe/loading-observable-pipe';
import { ILegalEntities } from '../interfaces/legal-entities.model';
import { INaturalPerson } from '../interfaces/natural-person.model';
import { IPersonModel } from '../interfaces/person.model';
import { PersonService } from '../services/person-service';

@Component({
    selector: 'app-person-list',
    imports: [Table, PageLoading],
    templateUrl: './person-list.html',
    styleUrl: './person-list.scss',
})
export class PersonList extends BaseList<IPersonModel, PersonService> {
    override service = inject(PersonService);

    private toastService = inject(ToastService);

    private pageLoadingService = inject(PageLoadingService);

    override buttonAddTitle: string = '';

    override buttonAddIcon: string = IMAGES.NEW;

    tableConfigNaturalPerson!: Signal<ITableConfig<INaturalPerson>>;

    tableConfigLegalEntities!: Signal<ITableConfig<ILegalEntities>>;

    constructor() {
        super();

        this.loadData();

        if (this.isNaturalPerson()) {
            this.loadTableConfigNaturalPerson();
        } else {
            this.loadTableConfigLegalEntities();
        }
    }

    public override onEditAction = (dataModel: IPersonModel) => {
        // this.router.navigate(['category', 'form', dataModel.id!]);
    };

    public override onRemoveAction = (dataModel: IPersonModel, callback: any) => {
        this.service
            .delete(dataModel.id!)
            .pipe(loadingObservablePipe(this.pageLoadingService))
            .subscribe({
                next: () => {
                    callback();
                    this.toastService.show('Registro removido com sucesso', 'success');
                },
                error: (errorData) => {
                    this.toastService.show(errorData.message, 'danger');
                },
            });
    };

    public override onRefreshAction = () => {
        this.service.getAll().subscribe((result) => {
            this.model.set(result);
        });
    };

    public override onAddAction = () => {
        const path = ['person', 'form'];

        if (this.isNaturalPerson()) {
            path.push('naturalPerson');
        } else {
            path.push('legalEntities');
        }
        this.router.navigate(path);
    };

    isNaturalPerson(): boolean {
        const personType = this.route.snapshot.routeConfig?.path?.includes('naturalPerson') ? 'F' : 'J';
        return personType !== 'J';
    }

    private loadTableConfigNaturalPerson() {
        this.title = 'Lista de Pessoas Físicas';
        this.buttonAddTitle = 'Adcionar Pessoa Física';

        this.tableConfigNaturalPerson = computed(() => {
            return {
                ...this.getTableConfigNaturalPerson(),
                data: this.model() as INaturalPerson[],
            };
        });
    }

    private getTableConfigNaturalPerson(): ITableConfig<INaturalPerson> {
        return {
            hasHover: true,
            data: this.model() as INaturalPerson[],
            titles: [
                {
                    name: 'Nome',
                    dataField: 'name',
                    transform: (data) => `${data.name} (${data.surname})`,
                },
                {
                    name: 'Sexo',
                    dataField: 'sex',
                    transform: (data) => (data.sex === 'F' ? 'Feminino' : 'Masculino'),
                },
                {
                    name: 'Data Nascimento',
                    dataField: 'birthDate',
                },
                {
                    name: 'RG',
                    dataField: 'stateDocument',
                    transform: (data) => data.stateDocument.number,
                },
                {
                    name: 'CPF',
                    dataField: 'federalDocument',
                    transform: (data) => data.federalDocument.number,
                },
            ],
            buttons: [
                {
                    icon: IMAGES.EDIT,
                    show: SHOW_ALWAYS,
                    name: '',
                    action: (dataModel) => {
                        this.onEditAction(dataModel);
                    },
                },
                {
                    icon: IMAGES.REMOVE,
                    show: SHOW_ALWAYS,
                    name: '',
                    action: (dataModel) => {
                        this.onRemoveAction(dataModel, this.onRefreshAction);
                    },
                },
            ],
        };
    }

    private loadTableConfigLegalEntities() {
        this.title = 'Lista de Pessoas Jurídicas';
        this.buttonAddTitle = 'Adcionar Pessoa Jurídica';

        this.tableConfigLegalEntities = computed(() => {
            return {
                ...this.getTableConfigLegalEntities(),
                data: this.model() as ILegalEntities[],
            };
        });
    }

    private getTableConfigLegalEntities(): ITableConfig<ILegalEntities> {
        return {
            hasHover: true,
            data: this.model() as ILegalEntities[],
            titles: [
                {
                    name: 'Nome',
                    dataField: 'name',
                },
                {
                    name: 'Nome Fantasia',
                    dataField: 'surname',
                },
                {
                    name: 'Insc. Estadual',
                    dataField: 'stateDocument',
                    transform: (data) => data.stateDocument.number,
                },
                {
                    name: 'CNPJ',
                    dataField: 'federalDocument',
                    transform: (data) => data.federalDocument.number,
                },
                {
                    name: 'Sócio',
                    dataField: 'naturalPerson',
                    transform: (data) => data.naturalPerson.name,
                },
            ],
            buttons: [
                {
                    icon: IMAGES.EDIT,
                    show: SHOW_ALWAYS,
                    name: '',
                    action: (dataModel) => {
                        this.onEditAction(dataModel);
                    },
                },
                {
                    icon: IMAGES.REMOVE,
                    show: SHOW_ALWAYS,
                    name: '',
                    action: (dataModel) => {
                        this.onRemoveAction(dataModel, this.onRefreshAction);
                    },
                },
            ],
        };
    }
}
