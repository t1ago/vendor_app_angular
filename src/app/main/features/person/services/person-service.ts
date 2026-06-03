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
                        return {
                            id: dataValue.id,
                            name: dataValue.nome,
                            surname: dataValue.apelido,
                            federalDocument: {
                                number: dataValue.documento_federeal,
                            },
                            stateDocument: {
                                number: dataValue.documento_estadual,
                            },
                            type: dataValue.tipo_pessoa,
                            active: dataValue.ativo === 'A',
                        } as INaturalPerson;
                    })
                    .filter((dataValue) => dataValue.active && dataValue.type === 'F');
            })
        );
    }

    override mapDto(model: IPersonModel): IPersonDto {
        if (this.isNaturalPerson(model)) {
            return this.mapNaturalPerson(model as INaturalPerson);
        } else {
            return this.mapLegalEntities(model as ILegalEntities);
        }
    }

    private mapNaturalPerson(model: INaturalPerson): IPersonDto {
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
            enderecos: model.addresses.map((address) => this.mapAddress(address)),
        };
    }

    private mapLegalEntities(model: ILegalEntities): IPersonDto {
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
            enderecos: model.addresses.map((address) => this.mapAddress(address)),
        };
    }

    private mapAddress(model: IAddressModel): IAddressDto {
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
}
