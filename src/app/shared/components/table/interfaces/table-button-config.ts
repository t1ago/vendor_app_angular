export interface TableButtonConfig<MODEL> {
    action: ((data: MODEL) => void)
    show: ((data: MODEL) => boolean)
    name: string;
    icon?: string;

}
