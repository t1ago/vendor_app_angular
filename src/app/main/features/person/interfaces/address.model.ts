import { IPersonModel } from './person.model';

export type AddressType = 'M' | 'C' | 'E';

export const ADDRESS_TYPE_LABEL: Record<AddressType, string> = {
    M: 'Moradia',
    C: 'Comercial',
    E: 'Entrega',
};

export interface IAddressModel {
    id: number | null;
    person: IPersonModel;
    zipCode: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    type: AddressType;
    searchByZipCode: boolean;
    active: boolean;
}
