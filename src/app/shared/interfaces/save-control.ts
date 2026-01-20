export enum ISateSaveControl {
  SAVING = 0,
  OPEN = 1,
}

export interface ISaveControl {
  state: ISateSaveControl;
  message: string;
}
