import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthStoreService } from '@shared/services/auth-store-service';
import { firstValueFrom } from 'rxjs';
import { Mocked } from 'vitest';
import { AuthUserService } from './auth-user-service';

describe('AuthUserService', () => {
    let service: AuthUserService;
    let httpMock: HttpTestingController;

    const apiUrl = 'http://localhost:3000/tiago/credencial/usuario';

    const authStoreServiceStub: Partial<Mocked<AuthStoreService>> = {
        setUser: vi.fn(),
    };

    beforeEach(() => {
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            providers: [
                AuthUserService,
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AuthStoreService, useValue: authStoreServiceStub },
            ],
        });

        service = TestBed.inject(AuthUserService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch user, map to IAuthUserModel and store user', async () => {
        // GIVEN
        const userDtoMock = {
            data: {
                idcredencial: 1,
                nomecredencial: 'Tiago',
                idperfil: 2,
                nomeperfil: 'Admin',
                identificadorperfil: 'ADMIN',
            },
        };

        const userPromise = firstValueFrom(service.user());

        const req = httpMock.expectOne(apiUrl);

        // WHEN
        req.flush(userDtoMock);

        const user = await userPromise;

        // THEN
        expect(req.request.method).toBe('GET');

        expect(user.credentialId).toBe(1);
        expect(user.credentialName).toBe('Tiago');
        expect(user.profileId).toBe(2);
        expect(user.profileName).toBe('Admin');
        expect(user.profileIdentifier).toBe('ADMIN');

        expect(authStoreServiceStub.setUser).toHaveBeenCalledWith(user);
    });

    it('should correctly map DTO to Model', () => {
        // GIVEN
        const dto = {
            idcredencial: 1,
            nomecredencial: 'Tiago',
            idperfil: 2,
            nomeperfil: 'Admin',
            identificadorperfil: 'ADMIN',
        };

        const model = {
            credentialId: 1,
            credentialName: 'Tiago',
            profileId: 2,
            profileName: 'Admin',
            profileIdentifier: 'ADMIN',
        };

        // WHEN - THEN
        expect(service.mapModel(dto)).toEqual(model);
    });
});
