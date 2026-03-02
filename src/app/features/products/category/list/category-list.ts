import { Component, inject } from '@angular/core';
import { ICategoryModel } from '../interfaces/category-model';
import { Table } from "@shared/components/table/table";
import { ITableConfig } from '@shared/components/table/interfaces/table-config';
import { CategoryService } from '../services/category-service';
import { BaseList } from '@shared/classes/base-list';
import { SHOW_ALWAYS } from '@shared/components/table/constants/table-constants';
import { IMAGES } from '@shared/constants/images';
import { ToastService } from '@shared/components/toast/services/toast-service';
import { PageLoading } from "@shared/components/page-loading/page-loading";
import { PageLoadingService } from '@shared/components/page-loading/services/page-loading-service';
import { loadingObservablePipe } from '@shared/observable-pipe/loading-observable-pipe';

@Component({
  selector: 'app-category-list',
  imports: [Table, PageLoading],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
  standalone: true,
})
export class CategoryList extends BaseList<ICategoryModel, CategoryService> {

  override service = inject(CategoryService);

  private toastService = inject(ToastService);

  private pageLoadingService = inject(PageLoadingService);

  override buttonAddTitle: string = 'Nova Categoria';

  override buttonAddIcon: string = IMAGES.NEW;

  constructor() {
    super()

    this.title = 'Lista de Categorias';
    this.loadData();
  }

  public override getTableConfig(): ITableConfig<ICategoryModel> {
    return {
      hasHover: true,
      data: this.model(),
      titles: [
        {
          name: 'Nome da Categoria',
          dataField: 'name'
        }
      ],
      buttons: [
        {
          icon: IMAGES.EDIT,
          show: SHOW_ALWAYS,
          name: '',
          action: (dataModel) => {
            this.onEditAction(dataModel);
          }
        },
        {
          icon: IMAGES.REMOVE,
          show: SHOW_ALWAYS,
          name: '',
          action: (dataModel) => {
            this.onRemoveAction(dataModel, this.onRefreshAction);
          }
        }
      ]
    }
  }

  public override onEditAction = (dataModel: ICategoryModel) => {
    this.router.navigate(['category', 'form', dataModel.id!])
  }

  public override onRemoveAction = (dataModel: ICategoryModel, callback: any) => {
    this.service.delete(dataModel.id!)
      .pipe(
        loadingObservablePipe(this.pageLoadingService)
      )
      .subscribe({
        next: () => {
          callback();
          this.toastService.show('Registro removido com sucesso', 'success');
        },
        error: (errorData) => {
          this.toastService.show(errorData.message, 'danger');
        }
      });
  };

  public override onRefreshAction = () => {
    this.service.getAll().subscribe((result) => {
      this.model.set(result);
    });
  };

  public override onAddAction = () => {
    this.router.navigate(['category', 'form'])
  };
}