import { Injectable } from '@angular/core';
import { BaseRequestService } from '@shared/services/base-request-service';
import { map, Observable } from 'rxjs';
import { IAddressDto } from '../interfaces/address.dto';
import { IAddressModel } from '../interfaces/address.model';
import { ILegalEntities } from '../interfaces/legal-entities.model';
import { INaturalPerson } from '../interfaces/natural-person.model';
import { IPersonDto } from '../interfaces/person.dto';
import { IPersonModel } from '../interfaces/person.model';

@Injectable({
    providedIn: 'root',
})
export class PersonService extends BaseRequestService<IPersonModel, IPersonDto> {
    override basePath: string = '/tiago/pessoa';

    override save(model: IPersonModel): Observable<Object> {
        console.log(model);
        if (model.id) {
            this.request = this.http.put(`${this.APIPath}/${model.id}`, this.mapDto(model));
        } else {
            this.request = this.http.post(`${this.APIPath}`, this.mapDto(model));
        }

        return this.resultObservable();
    }

    getNaturalPersonBy(term: string): Observable<INaturalPerson[]> {
        this.request = this.http.get(`${this.APIPath}?q=${term}&tipo_pessoa=F`);

        return this.resultObservable().pipe(
            map((value: any) => {
                const data = value.data as any[];

                return data
                    .map((dataValue) => {
                        return this.mapModelForList(dataValue) as INaturalPerson;
                    })
                    .filter((dataValue) => dataValue.active && dataValue.type === 'F');
            })
        );
    }

    getAllByType(type: string): Observable<IPersonModel[]> {
        this.request = this.http.get(`${this.APIPath}?tipo_pessoa=${type}`);

        return this.resultObservable().pipe(
            map((value: any) => {
                const data = value.data as any[];

                return data.map((dataValue) => {
                    if (dataValue.tipo_pessoa === 'F') {
                        return this.mapModelForList(dataValue) as INaturalPerson;
                    } else {
                        return this.mapModelForList(dataValue) as ILegalEntities;
                    }
                });
            })
        );
    }

    override mapDto(model: IPersonModel): IPersonDto {
        if (this.isNaturalPerson(model)) {
            return this.mapNaturalPersonDto(model as INaturalPerson);
        } else {
            return this.mapLegalEntitiesDto(model as ILegalEntities);
        }
    }

    private mapNaturalPersonDto(model: INaturalPerson): IPersonDto {
        const [year, month, day] = model.birthDate.split('-');

        return {
            id_pessoa: model.id,
            nome: model.name,
            apelido: model.surname,
            documento_estadual: model.stateDocument.number,
            documento_federeal: model.federalDocument.number,
            sexo: model.sex,
            data_inicio: `${day}/${month}/${year}`,
            tipo_pessoa: model.type,
            id_vinculo: null,
            ativo: model.active ? 'A' : 'I',
            enderecos: model.addresses.map((address) => this.mapAddressDto(address)),
        };
    }

    private mapLegalEntitiesDto(model: ILegalEntities): IPersonDto {
        return {
            id_pessoa: model.id,
            nome: model.name,
            apelido: model.surname,
            documento_estadual: model.stateDocument.number,
            documento_federeal: model.federalDocument.number,
            sexo: null,
            data_inicio: null,
            tipo_pessoa: model.type,
            id_vinculo: model.naturalPerson.id,
            ativo: model.active ? 'A' : 'I',
            enderecos: model.addresses.map((address) => this.mapAddressDto(address)),
        };
    }

    private mapAddressDto(model: IAddressModel): IAddressDto {
        return {
            id_endereco: model.id,
            cep: model.zipCode,
            logradouro: model.street,
            cidade: model.city,
            estado: model.state,
            numero: model.number,
            bairro: model.neighborhood,
            ativo: model.active ? 'A' : 'I',
            buscado_por_cep: model.searchByZipCode ? 'S' : 'N',
            tipo_endereco: model.type,
        };
    }

    private isNaturalPerson(model: IPersonModel): boolean {
        return model.type === 'F';
    }

    private mapModelForList(dto: any): IPersonModel {
        const isNaturalPerson = dto.tipo_pessoa === 'F';
        let model: IPersonModel;

        if (isNaturalPerson) {
            model = this.mapNaturalPersonModel(dto, true);
        } else {
            model = this.mapLegalEntitiesModel(dto, true);
        }

        return model;
    }

    private mapNaturalPersonModel(dto: any, forList: boolean): INaturalPerson {
        let birthDate = '';

        if (dto.data_inicio) {
            birthDate = dto.data_inicio.split('T')[0];
        }

        const model = {
            id: dto.id,
            name: dto.nome,
            surname: dto.apelido,
            type: dto.tipo_pessoa,
            sex: dto.sexo,
            birthDate: birthDate,
            federalDocument: {
                number: dto.documento_federeal,
            },
            stateDocument: {
                number: dto.documento_estadual,
            },
            active: dto.ativo === 'A',
            addresses: [],
        } as INaturalPerson;

        if (forList) {
            if (dto.id_moradia !== null) {
                model.addresses.push(this.mapAddressIdModel(dto.id_moradia));
            }

            if (dto.id_cobranca !== null) {
                model.addresses.push(this.mapAddressIdModel(dto.id_cobranca));
            }

            if (dto.id_entrega !== null) {
                model.addresses.push(this.mapAddressIdModel(dto.id_entrega));
            }
        }

        return model;
    }

    private mapLegalEntitiesModel(dto: any, forList: boolean): ILegalEntities {
        const naturalPerson = {
            id: dto.id_vinculo,
            nome: dto.nome_vinculo,
        };

        const model = {
            id: dto.id,
            name: dto.nome,
            surname: dto.apelido,
            type: dto.tipo_pessoa,
            federalDocument: {
                number: dto.documento_federeal,
            },
            stateDocument: {
                number: dto.documento_estadual,
            },
            active: dto.ativo === 'A',
            naturalPerson: this.mapNaturalPersonModel(naturalPerson, forList),
            addresses: [],
        } as ILegalEntities;

        if (forList) {
            if (dto.id_moradia !== null) {
                model.addresses.push(this.mapAddressIdModel(dto.id_moradia));
            }

            if (dto.id_cobranca !== null) {
                model.addresses.push(this.mapAddressIdModel(dto.id_cobranca));
            }

            if (dto.id_entrega !== null) {
                model.addresses.push(this.mapAddressIdModel(dto.id_entrega));
            }
        }

        return model;
    }

    private mapAddressIdModel(id: number): IAddressModel {
        return {
            id: id,
            zipCode: '',
            street: '',
            state: '',
            city: '',
            neighborhood: '',
            number: '',
            active: true,
            searchByZipCode: false,
            type: 'C',
        };
    }
}
