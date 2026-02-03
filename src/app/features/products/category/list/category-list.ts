import { Component, inject, WritableSignal } from '@angular/core';
import { ICategoryModel } from '../interfaces/category-model';
import { Table } from "../../../../shared/components/table/table";
import { TableConfig } from '../../../../shared/components/table/interfaces/table-config';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-category-list',
  imports: [Table],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
  standalone: true,
})
export class CategoryList {

  private route = inject(ActivatedRoute);

  tableConfig!: TableConfig<ICategoryModel>;

  constructor() {
    this.loadData()
  }

  private loadData() {
    const routeData = toSignal(this.route.data);
    const dataModel = routeData()?.['data'];

    this.tableConfig = {
      hasHover: true,
      data: dataModel,
      titles: [
        {
          name: 'Nome da Categoria',
          dataField: 'name'
        }
      ],
      buttons: []
    }

  }

}
