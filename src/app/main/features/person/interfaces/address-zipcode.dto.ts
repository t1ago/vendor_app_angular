import { IAddressStateDto } from './address-state.dto';

export interface IAddressZipCodeDto {
    cep: string;
    estado: IAddressStateDto;
    cidade: string;
    bairro: string;
    logradouro: string;
}
