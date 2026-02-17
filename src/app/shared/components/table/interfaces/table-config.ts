import { ITableButtonConfig } from "./table-button-config";
import { ITableTitleConfig } from "./table-title-config";

export interface ITableConfig<MODEL> {
    hasHover: boolean;
    titles: ITableTitleConfig<MODEL>[];
    data: MODEL[];
    buttons: ITableButtonConfig<MODEL>[]
}
