import { Injectable } from '@angular/core';
import { BaseRequestService } from '@shared/services/base-request-service';
import { map, Observable } from 'rxjs';
import { IMeasureDto } from '../interfaces/measure-dto';
import { IMeasureModel } from '../interfaces/measure-model';

@Injectable({
    providedIn: 'root',
})
export class MeasureService extends BaseRequestService<IMeasureModel, IMeasureDto> {
    override basePath: string = '/tiago/medida';

    override save(model: IMeasureModel): Observable<Object> {
        if (model.id) {
            this.request = this.http.put(`${this.APIPath}/${model.id}`, this.mapDto(model));
        } else {
            this.request = this.http.post(`${this.APIPath}`, this.mapDto(model));
        }
        return this.resultObservable();
    }

    override getById(id: number | string): Observable<IMeasureModel> {
        this.request = this.http.get(`${this.APIPath}/${id}`);
        return this.resultObservable().pipe(
            map((value: any) => this.mapModel(value.data))
        );
    }

    override getAll(): Observable<IMeasureModel[]> {
        this.request = this.http.get(`${this.APIPath}`);
        return this.resultObservable().pipe(
            map((value: any) => this.mapModels(value.data))
        );
    }

    override delete(id: number | string): Observable<Object> {
        this.request = this.http.delete(`${this.APIPath}/${id}`);
        return this.resultObservable();
    }

    override mapDto(model: IMeasureModel): IMeasureDto {
        return {
            id: model.id,
            nome: model.name,
        };
    }

    override mapModel(dto: IMeasureDto): IMeasureModel {
        return {
            id: dto.id,
            name: dto.nome,
        };
    }

    private mapModels(data: IMeasureDto[]): IMeasureModel[] {
        return data.map((dto: IMeasureDto) => this.mapModel(dto));
    }
}
