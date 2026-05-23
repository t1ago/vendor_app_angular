import { IPersonModel } from './person.model';

export type AddressType = 'M' | 'C' | 'E';

export interface IAddressModel {
    id: number | null;
    person: IPersonModel;
    zipCode: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    type: string;
    searchByZipCode: boolean;
    active: boolean;
}
