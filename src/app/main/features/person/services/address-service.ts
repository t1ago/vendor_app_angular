import { Injectable } from '@angular/core';
import { BaseRequestService } from '@shared/services/base-request-service';
import { map, Observable } from 'rxjs';
import { IAddressStateDto } from '../interfaces/address-state.dto';
import { IAddressStateModel } from '../interfaces/address-state.model';
import { IAddressZipCodeDto } from '../interfaces/address-zipcode.dto';
import { IAddressZipCodeModel } from '../interfaces/address-zipcode.model';

@Injectable({
    providedIn: 'root',
})
export class AddressService extends BaseRequestService<IAddressStateModel, IAddressStateDto> {
    override basePath: string = '/tiago/endereco';

    getStates(): Observable<IAddressStateModel[]> {
        this.request = this.http.get(`${this.APIPath}/estados`);

        return this.resultObservable().pipe(
            map((value: any) => {
                const addressStateDto = value.data as IAddressStateDto[];
                return addressStateDto
                    .map((data) => {
                        return {
                            abbreviation: data.sigla,
                            name: data.nome,
                        } as IAddressStateModel;
                    })
                    .sort((a, b) => a.name.localeCompare(b.name));
            })
        );
    }

    getByZipCode(zipCode: string): Observable<IAddressZipCodeModel> {
        const search = zipCode.replace('-', '');

        this.request = this.http.get(`${this.APIPath}/localidade/${search}`);

        return this.resultObservable().pipe(
            map((value: any) => {
                const data = value.data as IAddressZipCodeDto;
                return {
                    zipCode: data.cep,
                    city: data.cidade,
                    street: data.logradouro,
                    neighborhood: data.bairro,
                    state: {
                        abbreviation: data.estado.sigla,
                        name: data.estado.nome,
                    },
                };
            })
        );
    }
}
