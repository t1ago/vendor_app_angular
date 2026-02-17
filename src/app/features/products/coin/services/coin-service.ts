import { Injectable } from '@angular/core';
import { ICoinModel } from '../interfaces/coin-model';
import { ICoinDto } from '../interfaces/coin-dto';
import { BaseRequestService } from '../../../../shared/services/base-request-service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoinService extends BaseRequestService<ICoinModel, ICoinDto> {

  override save(model: ICoinModel): Observable<Object> {
    if (model.id) {
      this.request = this.http.put(`http://localhost:3000/moedas/${model.id}`, this.mapDto(model));
    } else {
      this.request = this.http.post('http://localhost:3000/moedas', this.mapDto(model));
    }

    return this.resultObservable();
  }

  override getById(id: number | string): Observable<ICoinModel> {
    this.request = this.http.get(`http://localhost:3000/moedas/${id}`);

    return this.resultObservable().pipe(
      map((value: any) => {
        return this.mapModel(value.data[0]);
      })
    );
  }

  override getAll(): Observable<ICoinModel[]> {
    this.request = this.http.get(`http://localhost:3000/moedas`);

    return this.resultObservable().pipe(
      map((value: any) => {
        return this.mapModels(value.data);
      })
    );
  }

  override delete(id: number | string): Observable<Object> {
    this.request = this.http.delete(`http://localhost:3000/moedas/${id}`);

    return this.resultObservable();
  }

  override mapDto(model: ICoinModel): ICoinDto {
    return {
      id: model.id,
      nome: model.name,
      moeda: model.symbol
    };
  }

  override mapModel(dto: ICoinDto): ICoinModel {
    return {
      id: dto.id,
      name: dto.nome,
      symbol: dto.moeda
    };
  }

  private mapModels(data: ICoinDto[]): ICoinModel[] {
    return data.map((value: ICoinDto) => {
      return this.mapModel(value)
    })
  }

}
