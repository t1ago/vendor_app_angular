import { Injectable } from '@angular/core';
import { BaseRequestService } from '@shared/services/base-request-service';
import { catchError, Observable, throwError } from 'rxjs';
import { ILoginDto } from '../interfaces/login-dto';
import { ILoginModel } from '../interfaces/login-model';
import { IAuthToken } from '@shared/interfaces/auth-token';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class LoginService extends BaseRequestService<ILoginModel, ILoginDto> {
    override basePath: string = '/tiago/credencial/login';

    login(model: ILoginModel): Observable<IAuthToken> {
        this.request = this.http
            .post(`${this.APIPath}`, null, {
                headers: {
                    Authorization: `Basic ${this.mapDto(model).basicAuthToken}`,
                },
            })
            .pipe(
                catchError((errorResponse) => {
                    this.logError(errorResponse);
                    throw errorResponse;
                })
            );

        return this.request as Observable<IAuthToken>;
    }

    override mapDto(model: ILoginModel): ILoginDto {
        return {
            basicAuthToken: btoa(`${model.email}:${model.password}`),
        };
    }
}
