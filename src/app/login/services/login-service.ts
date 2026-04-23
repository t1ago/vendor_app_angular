import { inject, Injectable } from '@angular/core';
import { IAuthLoginModel } from '@shared/interfaces/auth-login-model';
import { AuthLoginService } from '@shared/services/auth-login-service';
import { AuthStoreService } from '@shared/services/auth-store-service';
import { AuthUserService } from '@shared/services/auth-user-service';
import { catchError, map, Observable, switchMap, throwError, pipe } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoginService {
    private authLoginService = inject(AuthLoginService);

    private authUserService = inject(AuthUserService);

    private authStore = inject(AuthStoreService);

    login(model: IAuthLoginModel): Observable<boolean> {
        return this.authLoginService.login(model).pipe(
            switchMap(() => this.authUserService.user()),
            map((_) => {
                return this.isLogged();
            }),
            catchError((error) => {
                console.error(error);
                return throwError(() => error);
            })
        );
    }

    private isLogged(): boolean {
        return this.authStore.isLogged();
    }
}
