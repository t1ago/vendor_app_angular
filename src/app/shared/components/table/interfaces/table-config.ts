export interface TableConfig<MODEL> {
    hasHover: boolean;
    titles: TableTitleConfig<MODEL>[];
    data: MODEL[];
    buttons: TableButtonConfig<MODEL>[]
}

interface TableTitleConfig<MODEL> {
    name: string
    dataField: keyof MODEL;
}

interface TableButtonConfig<MODEL> {
    action: ((data: MODEL) => void)
    show: ((data: MODEL) => boolean)
    name: string;
    icon?: string;

}
