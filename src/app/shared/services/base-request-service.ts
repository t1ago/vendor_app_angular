import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UnauthorizedError } from '@shared/erros/unauthorized-error';
import { catchError, Observable } from 'rxjs';
import { ForeignKeyViolateError } from '../erros/foreign-key-violate-error';
import { EnvironmentService } from './environment-service';

@Injectable({
    providedIn: 'root',
})
export class BaseRequestService<MODEL, DTO> {
    http = inject(HttpClient);

    router = inject(Router);

    environmentService = inject(EnvironmentService);

    host: string = this.environmentService.vendorServiceHost;

    basePath: string = '';

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

    logError(error: any) {
        console.log(error);
    }

    unauthorizedError(error: any): never {
        this.router.navigate(['/unauthorized']);

        throw new UnauthorizedError(error.statusText);
    }

    defaultErrorResponse(errorResponse: any): never {
        const errorMessage = errorResponse.error.mensagem;

        if (errorMessage.toLowerCase().includes('violates foreign key constraint')) {
            throw new ForeignKeyViolateError();
        } else {
            throw errorResponse;
        }
    }

    resultObservable<RESULT>() {
        return this.request!.pipe(
            catchError((errorResponse) => {
                this.logError(errorResponse);
                const codeStatus = errorResponse.status;

                switch (codeStatus) {
                    case HttpStatusCode.Unauthorized:
                        this.unauthorizedError(errorResponse);
                    default:
                        this.defaultErrorResponse(errorResponse);
                }
            })
        ) as Observable<RESULT>;
    }

    get APIPath(): String {
        return `${this.host}${this.basePath}`;
    }
}
