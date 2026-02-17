import { Signal, signal, WritableSignal, inject, computed } from "@angular/core";
import { TableConfig } from "../components/table/interfaces/table-config";
import { ActivatedRoute, Router } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";

export class BaseList<MODEL, SERVICE> {

    model: WritableSignal<MODEL[]> = signal<MODEL[]>([])

    tableConfig!: Signal<TableConfig<MODEL>>;

    service!: SERVICE;

    route = inject(ActivatedRoute);

    router = inject(Router);

    title!: string;

    buttonAddTitle!: string;

    buttonAddIcon!: string;

    public onRemoveAction = (dataModel: MODEL, callback: any): void => {
        throw new Error('Method not implemented.');
    }

    public onEditAction = (dataModel: MODEL): void => {
        throw new Error('Method not implemented.');
    }

    public onRefreshAction = (): void => {
        throw new Error('Method not implemented.');
    }

    public onAddAction = (): void => {
        throw new Error('Method not implemented.');
    }

    public getTableConfig(): TableConfig<MODEL> {
        throw new Error('Method not implemented.');
    }

    public loadData() {
        const routeData = toSignal(this.route.data);
        this.model.set(routeData()?.['data']);

        this.tableConfig = computed(() => {
            return {
                ...this.getTableConfig(),
                data: this.model()
            }
        });
    }
}
