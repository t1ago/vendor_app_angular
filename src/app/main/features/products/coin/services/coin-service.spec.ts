import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ICoinDto } from '../interfaces/coin-dto';
import { CoinService } from './coin-service';

describe('CoinService', () => {
    let service: CoinService;
    let httpMock: HttpTestingController;
    const apiUrl = 'http://localhost:3000/moedas';

    beforeEach(() => {
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            providers: [CoinService, provideHttpClient(), provideHttpClientTesting()],
        });

        service = TestBed.inject(CoinService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch all coins and map them to ICoinModel[]', async () => {
        // GIVEN
        const coinDtoMock: { data: ICoinDto[] } = {
            data: [
                { id: 1, nome: 'Real', moeda: 'BRL' },
                { id: 2, nome: 'Dollar', moeda: 'USD' },
            ],
        };

        const getAllPromise = firstValueFrom(service.getAll());

        const req = httpMock.expectOne(apiUrl);

        // WHEN
        req.flush(coinDtoMock);

        const models = await getAllPromise;

        // THEN
        expect(req.request.method).toBe('GET');
        expect(models.length).toBe(2);
        expect(models[0].name).toBe('Real');
        expect(models[0].symbol).toBe('BRL');
    });

    it('should fetch a single coin by ID and map it to ICoinModel', async () => {
        // GIVEN
        const coinDtoMock = {
            data: [{ id: 1, nome: 'Real', moeda: 'BRL' }],
        };
        const coinId = 1;

        const getByIdPromise = firstValueFrom(service.getById(coinId));

        const req = httpMock.expectOne((request) => {
            return request.url === apiUrl && request.params.get('id') === String(coinId);
        });

        // WHEN
        req.flush(coinDtoMock);

        const model = await getByIdPromise;

        // THEN
        expect(req.request.method).toBe('GET');
        expect(req.request.params.get('id')).toBe(String(coinId));
        expect(model.id).toBe(1);
        expect(model.name).toBe('Real');
        expect(model.symbol).toBe('BRL');
    });

    it('should POST to create a new coin when id is missing', async () => {
        // GIVEN
        const newCoin = { name: 'Euro', symbol: 'EUR' };

        const coinResult = { success: true };

        const savePromise = firstValueFrom(service.save(newCoin as any));

        const req = httpMock.expectOne(apiUrl);

        // WHEN
        req.flush(coinResult);

        await savePromise;

        // THEN
        expect(req.request.method).toBe('POST');

        expect(req.request.body).toEqual({
            id: undefined,
            nome: 'Euro',
            moeda: 'EUR',
        });
    });

    it('should PUT to update an existing coin when id is present', async () => {
        // GIVEN
        const existingCoin = { id: 10, name: 'Bitcoin', symbol: 'BTC' };

        const coinResult = { success: true };

        const savePromise = firstValueFrom(service.save(existingCoin));

        const req = httpMock.expectOne(`${apiUrl}/${existingCoin.id}`);

        // WHEN
        req.flush(coinResult);

        await savePromise;

        // THEN
        expect(req.request.method).toBe('PUT');

        expect(req.request.body).toEqual({
            id: 10,
            nome: 'Bitcoin',
            moeda: 'BTC',
        });
    });

    it('should DELETE a coin by ID', async () => {
        // GIVEN
        const coinId = 5;

        const coinResult = {};

        const deletePromise = firstValueFrom(service.delete(coinId));

        const req = httpMock.expectOne(`${apiUrl}/${coinId}`);

        // WHEN
        req.flush(coinResult);

        await deletePromise;

        // THEN
        expect(req.request.method).toBe('DELETE');
    });

    it('should correctly map Model to DTO and DTO tp Model', () => {
        // GIVEN
        const model = { id: 99, name: 'Test', symbol: 'TST' };

        const dto = { id: 99, nome: 'Test', moeda: 'TST' };

        // WHEN - THEN
        expect(service.mapDto(model)).toEqual(dto);

        expect(service.mapModel(dto)).toEqual(model);
    });
});
