import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthStoreService } from '@shared/services/auth-store-service';
import { BaseRequestService } from '@shared/services/base-request-service';
import { firstValueFrom, Observable } from 'rxjs';
import { Mocked } from 'vitest';
import { HttpAuthInterceptor } from './http-auth-interceptor';

describe('HttpAuthInterceptor', () => {
    let service: TestService;
    let httpMock: HttpTestingController;
    let apiUrl = 'http://localhost:3000/test';

    const authStoreServiceStub: Partial<Mocked<AuthStoreService>> = {
        getToken: vi.fn(),
    };

    beforeEach(() => {
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            providers: [
                TestService,
                provideHttpClient(withInterceptors([HttpAuthInterceptor])),
                provideHttpClientTesting(),
                { provide: AuthStoreService, useValue: authStoreServiceStub },
            ],
        });

        service = TestBed.inject(TestService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should verify request has token in header', async () => {
        // GIVEN
        const tokenMock = 'abc';

        authStoreServiceStub.getToken?.mockReturnValueOnce(tokenMock);

        const getAllPromisse = firstValueFrom(service.getAll());

        const req = httpMock.expectOne(apiUrl);

        // WHEN
        req.flush(null);

        await getAllPromisse;

        // THEN
        expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${tokenMock}`);
    });

    it('should verify request without token in header', async () => {
        // GIVEN
        const tokenMock = '';

        authStoreServiceStub.getToken?.mockReturnValueOnce(tokenMock);

        const getAllPromisse = firstValueFrom(service.getAll());

        const req = httpMock.expectOne(apiUrl);

        // WHEN
        req.flush(null);

        await getAllPromisse;

        // THEN
        expect(req.request.headers.get('Authorization')).toEqual(null);
    });

    it('should verify request at login route', async () => {
        // GIVEN
        const tokenMock = 'abc';

        authStoreServiceStub.getToken?.mockReturnValueOnce(tokenMock);

        service.basePath = '/login';

        apiUrl = 'http://localhost:3000/login';

        const getAllPromisse = firstValueFrom(service.getAll());

        const req = httpMock.expectOne(apiUrl);

        // WHEN
        req.flush(null);

        await getAllPromisse;

        // THEN
        expect(req.request.headers.get('Authorization')).toEqual(null);
    });
});

interface ITestModel {}

interface ITestDto {}

class TestService extends BaseRequestService<ITestModel, ITestDto> {
    override basePath: string = '/test';

    override getAll(): Observable<ITestModel[]> {
        this.request = this.http.get(`${this.APIPath}`);

        return this.resultObservable();
    }
}
