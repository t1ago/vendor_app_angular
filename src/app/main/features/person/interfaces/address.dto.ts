export interface IAddressDto {
    id_endereco: number | null;
    cep: string;
    logradouro: string;
    numero: string | null;
    bairro: string;
    cidade: string;
    estado: string;
    tipo_endereco: string;
    buscado_por_cep: string;
    ativo: string;
}
