import { IAddressDto } from './address.dto';

export interface IPersonDto {
    id_pessoa: number | null;
    nome: string;
    apelido: string;
    tipo_pessoa: string;
    sexo: string | null;
    data_inicio: string | null;
    documento_estadual: string;
    documento_federeal: string;
    id_vinculo: number | null;
    ativo: boolean;
    enderecos: IAddressDto[];
}
