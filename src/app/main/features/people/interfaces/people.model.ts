import { IPeopleDocumentModel } from './people-document.model';

export type PeopleType = 'J' | 'F';

export interface IPeopleModel {
    id: number | null;
    name: string;
    surname: string;
    type: PeopleType;
    stateDocument: IPeopleDocumentModel;
    federalDocument: IPeopleDocumentModel;
    active: boolean;
}
