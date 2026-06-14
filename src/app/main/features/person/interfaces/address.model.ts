export type AddressType = 'M' | 'C' | 'E';

export interface IAddressModel {
    id: number | null;
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
