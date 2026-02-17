export interface TableTitleConfig<MODEL> {
    name: string
    dataField: keyof MODEL;
}
