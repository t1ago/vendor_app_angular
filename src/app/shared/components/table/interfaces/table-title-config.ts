export interface ITableTitleConfig<MODEL> {
    name: string
    dataField: keyof MODEL;
}
