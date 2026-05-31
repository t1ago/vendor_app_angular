export interface ITableButtonConfig<MODEL> {
    action: (data: MODEL, index: number) => void;
    show: (data: MODEL) => boolean;
    name: string;
    icon?: string;
}
