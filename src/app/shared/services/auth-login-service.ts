import { inject, Injectable } from '@angular/core';
import { IAuthLoginDto } from '@shared/interfaces/auth-login-dto';
import { IAuthLoginModel } from '@shared/interfaces/auth-login-model';
import { IAuthTokenDto } from '@shared/interfaces/auth-token-dto';
import { IAuthTokenModel } from '@shared/interfaces/auth-token-model';
import { AuthStoreService } from '@shared/services/auth-store-service';
import { BaseRequestService } from '@shared/services/base-request-service';
import { map, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthLoginService extends BaseRequestService<IAuthLoginModel, IAuthLoginDto> {
    override basePath: string = '/tiago/credencial/login';

    private authStore = inject(AuthStoreService);

    login(model: IAuthLoginModel): Observable<IAuthTokenModel> {
        const headers = {
            Authorization: `Basic ${this.mapDto(model).basicAuthToken}`,
        };

        return (this.request = this.http.post(`${this.APIPath}`, null, { headers: headers }).pipe(
            map((value: any) => {
                return this.mapModelAuthToken(value.data);
            }),
            tap((authToken: IAuthTokenModel) => {
                this.authStore.setAuthToken(authToken);
            })
        ));
    }

    override mapDto(model: IAuthLoginModel): IAuthLoginDto {
        return {
            basicAuthToken: btoa(`${model.email}:${model.password}`),
        };
    }

    private mapModelAuthToken(dto: IAuthTokenDto): IAuthTokenModel {
        return {
            token: dto.token,
            expiresIn: dto.expiresIn,
        };
    }
}
