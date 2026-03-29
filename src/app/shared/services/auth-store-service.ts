import { computed, Injectable, signal } from '@angular/core';
import { IAuthTokenModel } from '@shared/interfaces/auth-token-model';
import { IAuthUserModel } from '@shared/interfaces/auth-user-model';

@Injectable({
    providedIn: 'root',
})
export class AuthStoreService {
    token = signal<string>('');
    user = signal<IAuthUserModel>({} as any);
    expiresAt = signal<number>(0);

    isTokenExpired = computed(() => {
        const exp = this.expiresAt();
        return exp ? Date.now() > exp : true;
    });

    isLogged = computed(() => !!this.token() && !this.isTokenExpired());

    setAuthToken(authToken: IAuthTokenModel) {
        const expiresAt = Date.now() + authToken.expiresIn * 1000;

        this.token.set(authToken.token);
        this.expiresAt.set(expiresAt);

        localStorage.setItem('token', authToken.token);
        localStorage.setItem('expiresAt', expiresAt.toString());
    }

    setUser(user: IAuthUserModel) {
        this.user.set(user);
        localStorage.setItem('user', JSON.stringify(user));
    }

    loadFromStorage() {
        const token = localStorage.getItem('token');
        const exp = localStorage.getItem('expiresAt');
        const user = localStorage.getItem('user');

        if (token) this.token.set(token);
        if (exp) this.expiresAt.set(Number(exp));
        if (user) this.user.set(JSON.parse(user));
    }

    getToken() {
        return this.token();
    }

    logout() {
        this.token.set('');
        this.expiresAt.set(0);
        this.user.set({} as any);

        localStorage.removeItem('token');
        localStorage.removeItem('expiresAt');
        localStorage.removeItem('user');
    }
}
