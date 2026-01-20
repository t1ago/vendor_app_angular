import { Component, WritableSignal } from '@angular/core';
import { ICategoryModel } from '../interfaces/category-model';
import { Table } from "../../../../shared/components/table/table";
import { TableConfig } from '../../../../shared/components/table/interfaces/table-config';

@Component({
  selector: 'app-category-list',
  imports: [Table],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
  standalone: true,
})
export class CategoryList {

  tableConfig: TableConfig<ICategoryModel> = {
    hasHover: true,
    data: [{
      id: 1,
      name: 'Teste'
    },
    {
      id: 2,
      name: 'Teste'
    }
  ],
    titles: [{
      name: 'Nome da Categoria',
      dataField: 'name'
    }],
    buttons: [
      {
        name: 'salvar',
        show: (data) => {
          return true
        },
        action(data) {
        },
        icon: './assets/images/salvar.png'
      }
    ]
  }



}
