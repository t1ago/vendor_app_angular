import { computed, Injectable, signal } from '@angular/core';
import { IAuthUser } from '@shared/interfaces/auth-user';

@Injectable({
    providedIn: 'root',
})
export class AuthStoreService {
    token = signal<string>('');
    user = signal<IAuthUser>({} as any);
    expiresAt = signal<number>(0);

    isLogged = computed(() => !!this.token());
    isTokenExpired = computed(() => {
        const exp = this.expiresAt();
        return exp ? Date.now() > exp : true;
    });

    setAuth(token: string, expiresIn: number) {
        const expiresAt = Date.now() + expiresIn * 1000;

        this.token.set(token);
        this.expiresAt.set(expiresAt);

        localStorage.setItem('token', token);
        localStorage.setItem('expiresAt', expiresAt.toString());
    }

    setUser(user: IAuthUser) {
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
