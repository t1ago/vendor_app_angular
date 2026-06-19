import { Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BaseList } from '@shared/classes/base-list';
import { PageLoading } from '@shared/components/page-loading/page-loading';
import { PageLoadingService } from '@shared/components/page-loading/services/page-loading-service';
import { SHOW_ALWAYS } from '@shared/components/table/constants/table-constants';
import { ITableConfig } from '@shared/components/table/interfaces/table-config';
import { Table } from '@shared/components/table/table';
import { ToastService } from '@shared/components/toast/services/toast-service';
import { IMAGES } from '@shared/constants/images';
import { loadingObservablePipe } from '@shared/observable-pipe/loading-observable-pipe';
import { ICategoryModel } from '../interfaces/category-model';
import { CategoryService } from '../services/category-service';

@Component({
    selector: 'app-category-list',
    imports: [Table, PageLoading, TranslatePipe],
    templateUrl: './category-list.html',
    styleUrl: './category-list.scss',
})
export class CategoryList extends BaseList<ICategoryModel, CategoryService> {
    override service = inject(CategoryService);

    private toastService = inject(ToastService);

    private pageLoadingService = inject(PageLoadingService);

    private translate = inject(TranslateService);

    override buttonAddTitle: string = 'MAIN.FEATURES.CATEGORY.TITLE';

    override buttonAddIcon: string = IMAGES.NEW;

    constructor() {
        super();

        this.title = 'MAIN.FEATURES.CATEGORY.TITLE';
        this.loadTableConfig();
    }

    public override getTableConfig(): ITableConfig<ICategoryModel> {
        return {
            hasHover: true,
            data: this.model(),
            titles: [
                {
                    name: 'MAIN.FEATURES.CATEGORY.NAME',
                    dataField: 'name',
                },
            ],
            buttons: [
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
            ],
        };
    }

    public override onEditAction = (dataModel: ICategoryModel) => {
        this.router.navigate(['category', 'form', dataModel.id!]);
    };

    public override onRemoveAction = (dataModel: ICategoryModel, _callback: any) => {
        this.service
            .delete(dataModel.id!)
            .pipe(loadingObservablePipe(this.pageLoadingService))
            .subscribe({
                next: () => {
                    this.model.update((list) => list.filter((i) => i.id !== dataModel.id));
                    this.toastService.show(this.translate.instant('COMMONS.RECORDREMOVEDWITHSUCCESS'), 'success');
                },
                error: (errorData) => {
                    this.toastService.show(errorData.message, 'danger');
                },
            });
    };

    public override onAddAction = () => {
        this.router.navigate(['category', 'form']);
    };
}
