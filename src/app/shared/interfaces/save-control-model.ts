export enum ISateSaveControlModel {
    SAVING = 0,
    OPEN = 1,
}

export interface ISaveControlModel {
    state: ISateSaveControlModel;
    message: string;
}
