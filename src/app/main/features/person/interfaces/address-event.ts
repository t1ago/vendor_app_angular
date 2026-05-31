import { IAddressModel } from './address.model';

export interface IAddressEvent {
    address: IAddressModel;
    index?: number | null;
}
