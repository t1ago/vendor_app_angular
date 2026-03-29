import { inject, Injectable } from '@angular/core';
import { AuthStoreService } from '@shared/services/auth-store-service';
import { BaseRequestService } from '@shared/services/base-request-service';
import { map, Observable, tap } from 'rxjs';
import { IAuthUserModel } from '../interfaces/auth-user-model';
import { IAuthUserDto } from '../interfaces/auth-user-dto';

@Injectable({
    providedIn: 'root',
})
export class AuthUserService extends BaseRequestService<IAuthUserModel, IAuthUserDto> {
    override basePath: string = '/tiago/credencial/usuario';

    private authStore = inject(AuthStoreService);

    user(): Observable<IAuthUserModel> {
        return (this.request = this.http.get(`${this.APIPath}`).pipe(
            map((value: any) => {
                const userModel = this.mapModel(value.data);
                return userModel;
            }),
            tap((userModel: IAuthUserModel) => {
                this.authStore.setUser(userModel);
            })
        ));
    }

    override mapModel(dto: IAuthUserDto): IAuthUserModel {
        return {
            credentialId: dto.idcredencial,
            credentialName: dto.nomecredencial,
            profileId: dto.idperfil,
            profileName: dto.nomeperfil,
            profileIdentifier: dto.identificadorperfil,
        };
    }
}
