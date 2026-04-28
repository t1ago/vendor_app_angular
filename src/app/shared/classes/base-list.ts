import { computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ITableConfig } from '../components/table/interfaces/table-config';

export class BaseList<MODEL, SERVICE> {
    model: WritableSignal<MODEL[]> = signal<MODEL[]>([]);

    tableConfig!: Signal<ITableConfig<MODEL>>;

    service!: SERVICE;

    route = inject(ActivatedRoute);

    router = inject(Router);

    title!: string;

    buttonAddTitle!: string;

    buttonAddIcon!: string;

    public onRemoveAction = (dataModel: MODEL, callback: any): void => {
        throw new Error('Method not implemented.');
    };

    public onEditAction = (dataModel: MODEL): void => {
        throw new Error('Method not implemented.');
    };

    public onRefreshAction = (): void => {
        throw new Error('Method not implemented.');
    };

    public onAddAction = (): void => {
        throw new Error('Method not implemented.');
    };

    public getTableConfig(): ITableConfig<MODEL> {
        throw new Error('Method not implemented.');
    }

    public loadData() {
        const routeData = toSignal(this.route.data);
        this.model.set(routeData()?.['data']);

        this.tableConfig = computed(() => {
            return {
                ...this.getTableConfig(),
                data: this.model(),
            };
        });
    }
}
