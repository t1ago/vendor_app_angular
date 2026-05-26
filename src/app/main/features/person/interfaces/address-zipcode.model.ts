import { IAddressStateModel } from './address-state.model';

export interface IAddressZipCodeModel {
    zipCode: string;
    state: IAddressStateModel;
    city: string;
    neighborhood: string;
    street: string;
}
