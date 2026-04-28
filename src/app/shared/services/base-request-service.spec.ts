import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { ForeignKeyViolateError } from '../erros/foreign-key-violate-error';
import { BaseRequestService } from './base-request-service';

@Injectable()
class TestService extends BaseRequestService<any, any> {
    override basePath = '/test';
}

describe('BaseRequestService', () => {
    let service: TestService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            providers: [TestService, provideHttpClient(), provideHttpClientTesting()],
        });

        service = TestBed.inject(TestService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return data when request is successful', async () => {
        // GIVEN
        const mockData = { id: 1 };
        service.request = of(mockData);

        // WHEN
        const response = await firstValueFrom(service.resultObservable());

        // THEN
        expect(response).toEqual(mockData);
    });

    it('should throw ForeignKeyViolateError when message contains "violates foreign key constraint"', async () => {
        // GIVEN
        const errorResponse = { error: { mensagem: 'violates foreign key constraint' } };
        service.request = throwError(() => errorResponse);

        // WHEN - THEN
        await expect(firstValueFrom(service.resultObservable())).rejects.toThrow(ForeignKeyViolateError);
    });

    it('should throw original error when it is NOT a foreign key violation', async () => {
        // GIVEN
        const errorResponse = { error: { mensagem: 'Generic Error' } };
        service.request = throwError(() => errorResponse);

        // WHEN - THEN
        await expect(firstValueFrom(service.resultObservable())).rejects.toEqual(errorResponse);
    });

    it('should call defaultError and log to console on failure', async () => {
        // GIVEN
        const consoleSpy = vi.spyOn(console, 'log');
        const errorResponse = { error: { mensagem: 'Error' } };
        service.request = throwError(() => errorResponse);

        // WHEN
        await expect(firstValueFrom(service.resultObservable())).rejects.toBeDefined();

        // THEN
        expect(consoleSpy).toHaveBeenCalledWith(errorResponse);
    });

    it('should throw "Method not implemented" for base methods', () => {
        // GIVEN - WHEN - THEN
        expect(() => service.save({})).toThrow('Method not implemented.');
        expect(() => service.getById(1)).toThrow('Method not implemented.');
        expect(() => service.getAll()).toThrow('Method not implemented.');
        expect(() => service.delete(1)).toThrow('Method not implemented.');
        expect(() => service.mapDto({})).toThrow('Method not implemented.');
        expect(() => service.mapModel({})).toThrow('Method not implemented.');
    });

    it('should return the correct APIPath', () => {
        // GIVEN - WHEN
        const apiPath = service.APIPath;

        // THEN
        expect(apiPath).toBe('http://localhost:3000/test');
    });

    it('should call unauthorizedError, navigate and throw UnauthorizedError when status is 401', async () => {
        // GIVEN
        const routerSpy = vi.spyOn(service.router, 'navigate');
        const errorResponse = { status: 401, statusText: 'Unauthorized' };

        service.request = throwError(() => errorResponse);

        // WHEN - THEN
        await expect(firstValueFrom(service.resultObservable())).rejects.toThrow('Unauthorized');

        expect(routerSpy).toHaveBeenCalledWith(['/unauthorized']);
    });
});
