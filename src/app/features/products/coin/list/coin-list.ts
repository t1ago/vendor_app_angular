import { Component, inject } from '@angular/core';
import { Table } from '../../../../shared/components/table/table';
import { BaseList } from '../../../../shared/classes/base-list';
import { ICoinModel } from '../interfaces/coin-model';
import { CoinService } from '../services/coin-service';
import { ToastService } from '../../../../shared/components/toast/services/toast-service';
import { IMAGES } from '../../../../shared/constants/images';
import { ITableConfig } from '../../../../shared/components/table/interfaces/table-config';
import { SHOW_ALWAYS } from '../../../../shared/components/table/constants/table-constants';

@Component({
  selector: 'app-coin-list',
  imports: [Table],
  templateUrl: './coin-list.html',
  styleUrl: './coin-list.scss',
})
export class CoinList extends BaseList<ICoinModel, CoinService> {
  override service = inject(CoinService);

  private toastService = inject(ToastService);

  override buttonAddTitle: string = 'Nova Moeda';

  override buttonAddIcon: string = IMAGES.NEW;

  constructor() {
    super()

    this.title = 'Lista de Moedas';
    this.loadData();
  }

  public override getTableConfig(): ITableConfig<ICoinModel> {
    return {
      hasHover: true,
      data: this.model(),
      titles: [
        {
          name: 'Símbolo',
          dataField: 'symbol'
        },
        {
          name: 'Nome da Moeda',
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

  public override onEditAction = (dataModel: ICoinModel) => {
    this.router.navigate(['coin', 'form', dataModel.id!])
  }

  public override onRemoveAction = (dataModel: ICoinModel, callback: any) => {
    this.service.delete(dataModel.id!).subscribe({
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
    this.router.navigate(['coin', 'form'])
  };
}
