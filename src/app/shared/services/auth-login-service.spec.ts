import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthStoreService } from '@shared/services/auth-store-service';
import { firstValueFrom } from 'rxjs';
import { Mocked } from 'vitest';
import { AuthLoginService } from './auth-login-service';

describe('AuthLoginService', () => {
    let service: AuthLoginService;
    let httpMock: HttpTestingController;

    const apiUrl = 'http://localhost:3000/tiago/credencial/login';

    const authStoreServiceStub: Partial<Mocked<AuthStoreService>> = {
        setAuthToken: vi.fn(),
    };

    beforeEach(() => {
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            providers: [
                AuthLoginService,
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AuthStoreService, useValue: authStoreServiceStub },
            ],
        });

        service = TestBed.inject(AuthLoginService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should login and return IAuthTokenModel and store token', async () => {
        // GIVEN
        const loginModel = {
            email: 'test@email.com',
            password: '123456',
        };

        const authTokenDtoMock = {
            data: {
                token: 'abc123',
                expiresIn: 3600,
            },
        };

        const loginPromise = firstValueFrom(service.login(loginModel));

        const req = httpMock.expectOne(apiUrl);

        // WHEN
        req.flush(authTokenDtoMock);

        const authToken = await loginPromise;

        // THEN
        expect(req.request.method).toBe('POST');

        const expectedBasic = btoa(`${loginModel.email}:${loginModel.password}`);
        expect(req.request.headers.get('Authorization')).toBe(`Basic ${expectedBasic}`);

        expect(authToken.token).toBe('abc123');
        expect(authToken.expiresIn).toBe(3600);

        expect(authStoreServiceStub.setAuthToken).toHaveBeenCalledWith(authToken);
    });

    it('should correctly map Model to DTO', () => {
        // GIVEN
        const model = {
            email: 'test@email.com',
            password: '123456',
        };

        const dto = {
            basicAuthToken: btoa('test@email.com:123456'),
        };

        // WHEN - THEN
        expect(service.mapDto(model)).toEqual(dto);
    });
});
