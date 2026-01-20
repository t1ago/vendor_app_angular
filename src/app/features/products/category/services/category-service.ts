import { Injectable } from '@angular/core';
import { ICategoryModel } from '../interfaces/category-model';
import { ICategoryDto } from '../interfaces/category-dto';
import { BaseRequestService } from '../../../../shared/services/base-request-service';
import { catchError, map, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseRequestService<ICategoryModel, ICategoryDto> {
  override save(model: ICategoryModel): Observable<Object> {
    if (model.id) {
      this.request = this.http.put(`http://localhost:3000/categorias/${model.id}`, this.mapDto(model));
    } else {
      this.request = this.http.post('http://localhost:3000/categorias', this.mapDto(model));
    }

    return this.resultObservable();
  }

  override getById(id: number | string): Observable<Object> {
    this.request = this.http.get(`http://localhost:3000/categorias/${id}`);

    return this.resultObservable().pipe(
      map((value: any) => {
        return this.mapModel(value.data[0]);
      })
    );
  }

  override mapDto(model: ICategoryModel): ICategoryDto {
    return {
      id: model.id,
      nome: model.name,
    };
  }

  override mapModel(dto: ICategoryDto): ICategoryModel {
    return {
      id: dto.id,
      name: dto.nome,
    };
  }
}
