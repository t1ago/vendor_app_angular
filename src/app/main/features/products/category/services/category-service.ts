import { Injectable } from '@angular/core';
import { BaseRequestService } from '@shared/services/base-request-service';
import { map, Observable } from 'rxjs';
import { ICategoryDto } from '../interfaces/category-dto';
import { ICategoryModel } from '../interfaces/category-model';

@Injectable({
    providedIn: 'root',
})
export class CategoryService extends BaseRequestService<ICategoryModel, ICategoryDto> {
    override basePath: string = '/tiago/categoria';

    override save(model: ICategoryModel): Observable<Object> {
        if (model.id) {
            this.request = this.http.put(`${this.APIPath}/${model.id}`, this.mapDto(model));
        } else {
            this.request = this.http.post(`${this.APIPath}`, this.mapDto(model));
        }

        return this.resultObservable();
    }

    override getById(id: number | string): Observable<ICategoryModel> {
        this.request = this.http.get(`${this.APIPath}/${id}`);

        return this.resultObservable().pipe(
            map((value: any) => {
                return this.mapModel(value.data[0]);
            })
        );
    }

    override getAll(): Observable<ICategoryModel[]> {
        this.request = this.http.get(`${this.APIPath}`);

        return this.resultObservable().pipe(
            map((value: any) => {
                return this.mapModels(value.data);
            })
        );
    }

    override delete(id: number | string): Observable<Object> {
        this.request = this.http.delete(`${this.APIPath}/${id}`);

        return this.resultObservable();
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

    private mapModels(data: ICategoryDto[]): ICategoryModel[] {
        return data.map((value: ICategoryDto) => {
            return this.mapModel(value);
        });
    }
}
