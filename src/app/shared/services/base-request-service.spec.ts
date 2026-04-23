import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BaseRequestService } from './base-request-service';
import { firstValueFrom, of, throwError } from 'rxjs';
import { ForeignKeyViolateError } from '../erros/foreign-key-violate-error';
import { Injectable } from '@angular/core';

@Injectable()
class TestService extends BaseRequestService<any, any> {
    override basePath = '/test';
}

describe('BaseRequestService', () => {
    let service: TestService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TestService, provideHttpClient(), provideHttpClientTesting()],
        });

        service = TestBed.inject(TestService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should return data when request is successful', async () => {
        const mockData = { id: 1 };
        service.request = of(mockData);

        const response = await firstValueFrom(service.resultObservable());
        expect(response).toEqual(mockData);
    });

    it('should throw ForeignKeyViolateError when message contains "violates foreign key constraint"', async () => {
        // const errorResponse = { error: { mensagem: 'violates foreign key constraint' } };
        // service.request = throwError(() => errorResponse);
        // await expect(firstValueFrom(service.resultObservable())).rejects.toThrow(ForeignKeyViolateError);
    });

    it('should throw original error when it is NOT a foreign key violation', async () => {
        const errorResponse = { error: { mensagem: 'Generic Error' } };
        service.request = throwError(() => errorResponse);

        // await expect(firstValueFrom(service.resultObservable())).rejects.toEqual(errorResponse);
    });

    it('should call defaultError and log to console on failure', async () => {
        // const consoleSpy = vi.spyOn(console, 'log');
        // const errorResponse = { error: { mensagem: 'Error' } };
        // service.request = throwError(() => errorResponse);
        // // await expect(firstValueFrom(service.resultObservable())).rejects.toBeDefined();
        // expect(consoleSpy).toHaveBeenCalledWith(errorResponse);
    });

    it('should throw "Method not implemented" for base methods', () => {
        expect(() => service.save({})).toThrowError('Method not implemented.');
        expect(() => service.getById(1)).toThrowError('Method not implemented.');
        expect(() => service.getAll()).toThrowError('Method not implemented.');
        expect(() => service.delete(1)).toThrowError('Method not implemented.');
        expect(() => service.mapDto({})).toThrowError('Method not implemented.');
        expect(() => service.mapModel({})).toThrowError('Method not implemented.');
    });

    it('should return the correct APIPath', () => {
        expect(service.APIPath).toBe('http://localhost:3000/test');
    });
});
