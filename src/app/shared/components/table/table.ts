import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ITableConfig } from './interfaces/table-config';

@Component({
    selector: 'app-table',
    imports: [TranslatePipe],
    templateUrl: './table.html',
    styleUrl: './table.scss',
})
export class Table<MODEL> {
    tableConfig = input<ITableConfig<MODEL>>();

    isInactive(item: MODEL): boolean {
        return 'active' in (item as any) && (item as any).active === false;
    }

    get titles() {
        return this.tableConfig()!.titles;
    }

    get data() {
        return this.tableConfig()!.data;
    }

    get buttons() {
        return this.tableConfig()!.buttons;
    }

    get hasHover() {
        return this.tableConfig()!.hasHover;
    }

    get emptyColSpan() {
        return this.titles.length + (this.buttons.length > 0 ? 1 : 0);
    }
}
