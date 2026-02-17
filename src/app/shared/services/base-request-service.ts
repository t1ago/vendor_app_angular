import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { ForeignKeyViolateError } from '../erros/foreign-key-violate-error';

@Injectable({
  providedIn: 'root',
})
export class BaseRequestService<MODEL, DTO> {
  http = inject(HttpClient);

  host: string = 'http://localhost:3000';
  request: Observable<Object> | undefined;

  save(model: MODEL): Observable<Object> {
    throw new Error('Method not implemented.');
  }

  getById(id: number | string): Observable<MODEL> {
    throw new Error('Method not implemented.');
  }

  getAll(): Observable<MODEL[]> {
    throw new Error('Method not implemented.');
  }

  delete(id: number | string): Observable<Object> {
    throw new Error('Method not implemented.');
  }

  mapDto(model: MODEL): DTO {
    throw new Error('Method not implemented.');
  }

  mapModel(dto: DTO): MODEL {
    throw new Error('Method not implemented.');
  }

  defaultError(error: any) {
    console.log(error);
  }

  resultObservable() {
    return this.request!.pipe(
      catchError((errorResponse) => {
        this.defaultError(errorResponse);
        const errorMessage = errorResponse.error.mensagem;

        if (errorMessage.toLowerCase().includes('violates foreign key constraint')) {
          throw new ForeignKeyViolateError()
        } else {
          throw errorResponse;
        }
      })
    );
  }
}
