import { TableButtonConfig } from "./table-button-config";
import { TableTitleConfig } from "./table-title-config";

export interface TableConfig<MODEL> {
    hasHover: boolean;
    titles: TableTitleConfig<MODEL>[];
    data: MODEL[];
    buttons: TableButtonConfig<MODEL>[]
}
