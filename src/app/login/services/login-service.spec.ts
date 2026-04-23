import { TestBed } from '@angular/core/testing';

import { LoginService } from './login-service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Mocked, vi } from 'vitest';
import { AuthLoginService } from '@shared/services/auth-login-service';
import { AuthUserService } from '@shared/services/auth-user-service';
import { AuthStoreService } from '@shared/services/auth-store-service';
import { IAuthLoginModel } from '@shared/interfaces/auth-login-model';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { IAuthUserModel } from '@shared/interfaces/auth-user-model';
import { of, throwError } from 'rxjs';
import { IAuthTokenModel } from '@shared/interfaces/auth-token-model';

describe('LoginService', () => {
    let service: LoginService;

    const authLoginServiceStub: Partial<Mocked<AuthLoginService>> = {
        login: vi.fn(),
    };

    const authUserServiceStub: Partial<Mocked<AuthUserService>> = {
        user: vi.fn(),
    };

    const authStoreServiceStub: Partial<Mocked<AuthStoreService>> = {
        isLogged: vi.fn(),
    };

    beforeEach(() => {
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            providers: [
                LoginService,
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AuthLoginService, useValue: authLoginServiceStub },
                { provide: AuthUserService, useValue: authUserServiceStub },
                { provide: AuthStoreService, useValue: authStoreServiceStub },
            ],
        });

        service = TestBed.inject(LoginService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should successful login', async () => {
        // GIVEN
        const loginModelMock: IAuthLoginModel = {
            email: 'Test@Test.com',
            password: '123456',
        };

        const tokenModelMock: IAuthTokenModel = {
            token: 'abc123',
            expiresIn: 3600,
        };

        const userModelMock: IAuthUserModel = {
            credentialId: 0,
            credentialName: 'Test',
            profileId: 0,
            profileName: 'Adm Test',
            profileIdentifier: 'ADMTEST',
        };

        authLoginServiceStub.login?.mockReturnValueOnce(of(tokenModelMock));
        authUserServiceStub.user?.mockReturnValueOnce(of(userModelMock));
        authStoreServiceStub.isLogged?.mockReturnValueOnce(true);

        // WHEN
        const loginPromise = firstValueFrom(service.login(loginModelMock));
        const loginResult = await loginPromise;

        // THEN
        expect(true).toBe(loginResult);
    });

    it('should Error login', async () => {
        // GIVEN
        const loginModelMock: IAuthLoginModel = {
            email: 'Test@Test.com',
            password: '123456',
        };

        const errorMock = new Error('Error Login');

        authLoginServiceStub.login?.mockReturnValueOnce(throwError(() => errorMock));

        // WHEN
        const loginPromise = firstValueFrom(service.login(loginModelMock));

        // THEN
        await expect(loginPromise).rejects.toThrow(errorMock);
    });
});
