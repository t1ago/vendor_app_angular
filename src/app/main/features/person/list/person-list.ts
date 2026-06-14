import { Component, computed, inject, Signal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BaseList } from '@shared/classes/base-list';
import { PageLoading } from '@shared/components/page-loading/page-loading';
import { PageLoadingService } from '@shared/components/page-loading/services/page-loading-service';
import { SHOW_ALWAYS } from '@shared/components/table/constants/table-constants';
import { ITableButtonConfig } from '@shared/components/table/interfaces/table-button-config';
import { ITableConfig } from '@shared/components/table/interfaces/table-config';
import { Table } from '@shared/components/table/table';
import { ToastService } from '@shared/components/toast/services/toast-service';
import { IMAGES } from '@shared/constants/images';
import { loadingObservablePipe } from '@shared/observable-pipe/loading-observable-pipe';
import { inputDateToBrazilian } from '@shared/types/date.type';
import { IAddressModel } from '../interfaces/address.model';
import { ILegalEntities } from '../interfaces/legal-entities.model';
import { INaturalPerson } from '../interfaces/natural-person.model';
import { IPersonModel } from '../interfaces/person.model';
import { makePath } from '../routes/person-path';
import { PersonService } from '../services/person-service';

@Component({
    selector: 'app-person-list',
    imports: [Table, PageLoading, TranslatePipe],
    templateUrl: './person-list.html',
    styleUrl: './person-list.scss',
})
export class PersonList extends BaseList<IPersonModel, PersonService> {
    override service = inject(PersonService);

    private toastService = inject(ToastService);

    private pageLoadingService = inject(PageLoadingService);

    private translate = inject(TranslateService);

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
        const path = makePath(this.isNaturalPerson(), 'form', String(dataModel.id!));
        this.router.navigate(path);
    };

    public override onRemoveAction = (dataModel: IPersonModel, callback: any) => {
        this.service
            .delete(dataModel.id!)
            .pipe(loadingObservablePipe(this.pageLoadingService))
            .subscribe({
                next: () => {
                    this.updateToInactiveModel(this.model(), dataModel.id!);
                    this.toastService.show(this.translate.instant('COMMONS.RECORDREMOVEDWITHSUCCESS'), 'success');
                },
                error: (errorData) => {
                    this.toastService.show(errorData.message, 'danger');
                },
            });
    };

    public override onAddAction = () => {
        const path = makePath(this.isNaturalPerson(), 'form');
        this.router.navigate(path);
    };

    isNaturalPerson(): boolean {
        const personType = this.route.snapshot.routeConfig?.path?.includes('naturalPerson') ? 'F' : 'J';
        return personType !== 'J';
    }

    private loadTableConfigNaturalPerson() {
        this.title = 'MAIN.FEATURES.PERSON.PERSONTYPENATURAL';
        this.buttonAddTitle = this.title;

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
                    name: 'MAIN.FEATURES.PERSON.PERSONNAMENATURAL',
                    dataField: 'name',
                    transform: (data) => `${data.name} (${data.surname})`,
                },
                {
                    name: 'MAIN.FEATURES.PERSON.PERSONSEX',
                    dataField: 'sex',
                    transform: (data) =>
                        data.sex === 'F'
                            ? this.translate.instant('MAIN.FEATURES.PERSON.PERSONSEXFEMALE')
                            : this.translate.instant('MAIN.FEATURES.PERSON.PERSONSEXMALE'),
                },
                {
                    name: 'MAIN.FEATURES.PERSON.PERSONBIRTHDATE',
                    dataField: 'birthDate',
                    transform: (data) => inputDateToBrazilian(data.birthDate),
                },
                {
                    name: 'MAIN.FEATURES.PERSON.PERSONSTATEDOCUMENTNATURAL',
                    dataField: 'stateDocument',
                    transform: (data) => data.stateDocument.number,
                },
                {
                    name: 'MAIN.FEATURES.PERSON.PERSONFEDERALDOCUMENTNATURAL',
                    dataField: 'federalDocument',
                    transform: (data) => data.federalDocument.number,
                },
            ],
            buttons: this.makeAddressButtons(),
        };
    }

    private loadTableConfigLegalEntities() {
        this.title = 'MAIN.FEATURES.PERSON.PERSONTYPELEGAL';
        this.buttonAddTitle = this.title;

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
                    name: 'MAIN.FEATURES.PERSON.PERSONNAMELEGAL',
                    dataField: 'name',
                },
                {
                    name: 'MAIN.FEATURES.PERSON.PERSONSURNAMELEGAL',
                    dataField: 'surname',
                },
                {
                    name: 'MAIN.FEATURES.PERSON.PERSONSTATEDOCUMENTLEGAL',
                    dataField: 'stateDocument',
                    transform: (data) => data.stateDocument.number,
                },
                {
                    name: 'MAIN.FEATURES.PERSON.PERSONFEDERALDOCUMENTLEGAL',
                    dataField: 'federalDocument',
                    transform: (data) => data.federalDocument.number,
                },
                {
                    name: 'MAIN.FEATURES.PERSON.PERSONNATURALPERSONID',
                    dataField: 'naturalPerson',
                    transform: (data) => data.naturalPerson.name,
                },
            ],
            buttons: this.makeAddressButtons(),
        };
    }

    private updateToInactiveModel(model: IPersonModel[], id: number) {
        this.model.update((list) => list.map((item) => (item.id === id ? { ...item, active: false } : item)));
    }

    private makeAddressButtons(): ITableButtonConfig<IPersonModel>[] {
        return [
            {
                icon: IMAGES.RESIDENTIAL_ADDRESS,
                show: (data) => data.addresses?.some((address) => address.id && address.type === 'M') ?? false,
                name: '',
                action: (data) => {
                    const address = data.addresses?.find((address) => address.type === 'M');
                    if (address?.id) this.fetchAndOpenMaps(data.id!, address.id);
                },
            },
            {
                icon: IMAGES.BILLING_ADDRESS,
                show: (data) => data.addresses?.some((address) => address.id && address.type === 'C') ?? false,
                name: '',
                action: (data) => {
                    const address = data.addresses?.find((address) => address.type === 'C');
                    if (address?.id) this.fetchAndOpenMaps(data.id!, address.id);
                },
            },
            {
                icon: IMAGES.DELIVERY_ADDRESS,
                show: (data) => data.addresses?.some((address) => address.id && address.type === 'E') ?? false,
                name: '',
                action: (data) => {
                    const address = data.addresses?.find((address) => address.type === 'E');
                    if (address?.id) this.fetchAndOpenMaps(data.id!, address.id);
                },
            },
            {
                icon: IMAGES.EDIT,
                show: SHOW_ALWAYS,
                name: '',
                action: (dataModel) => this.onEditAction(dataModel),
            },
            {
                icon: IMAGES.REMOVE,
                show: SHOW_ALWAYS,
                name: '',
                action: (dataModel) => this.onRemoveAction(dataModel, null),
            },
        ];
    }

    private fetchAndOpenMaps(personId: number, addressId: number): void {
        this.service
            .getAddressByIdPersonAndIdAddress(personId, addressId)
            .pipe(loadingObservablePipe(this.pageLoadingService))
            .subscribe({
                next: (address) => {
                    if (address.active == false) {
                        this.toastService.show(
                            this.translate.instant('MAIN.FEATURES.ADDRESS.INACTIVESEARCHADDRESS'),
                            'info'
                        );
                        setTimeout(() => this.openGoogleMaps(address), 3001);
                    } else {
                        this.openGoogleMaps(address);
                    }
                },
                error: () =>
                    this.toastService.show(this.translate.instant('MAIN.FEATURES.ADDRESS.FAILSEARCHADDRESS'), 'danger'),
            });
    }

    private openGoogleMaps(address: IAddressModel): void {
        const query = encodeURIComponent(
            `${address.street}, ${address.number}, ${address.neighborhood}, ${address.city} - ${address.state}, ${address.zipCode}`
        );
        console.log(address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
}
