import { IAddressModel } from './address.model';
import { IPersonDocumentModel } from './person-document.model';

export type PersonType = 'J' | 'F';

export interface IPersonModel {
    id: number | null;
    name: string;
    surname: string;
    type: PersonType;
    stateDocument: IPersonDocumentModel;
    federalDocument: IPersonDocumentModel;
    active: boolean;
    addresses: IAddressModel[];
}
