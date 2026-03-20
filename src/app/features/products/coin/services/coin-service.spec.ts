import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { CoinService } from './coin-service';
import { ICoinDto } from '../interfaces/coin-dto';
import { ICoinModel } from '../interfaces/coin-model';

describe('CoinService', () => {
    let service: CoinService;
    let httpMock: HttpTestingController;
    const apiUrl = 'http://localhost:3000/moedas';

    beforeEach(() => {
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

    it('should fetch all coins and map to ICoinModel[]', async () => {
        const mockDtoResponse: { data: ICoinDto[] } = {
            data: [
                { id: 1, nome: 'Real', moeda: 'BRL' },
                { id: 2, nome: 'Dólar', moeda: 'USD' },
            ],
        };

        const requestPromise = firstValueFrom(service.getAll());

        const req = httpMock.expectOne(apiUrl);
        expect(req.request.method).toBe('GET');
        req.flush(mockDtoResponse);

        const result = await requestPromise;

        expect(result.length).toBe(2);
        expect(result[0].symbol).toBe('BRL');
        expect(result[1].name).toBe('Dólar');
    });

    it('should fetch a single coin using query params', async () => {
        const coinId = 123;
        const mockDtoResponse = {
            data: [{ id: 123, nome: 'Bitcoin', moeda: 'BTC' }],
        };

        const requestPromise = firstValueFrom(service.getById(coinId));

        const req = httpMock.expectOne((r) => r.url === apiUrl && r.params.has('id'));
        expect(req.request.params.get('id')).toBe('123');

        req.flush(mockDtoResponse);
        const result = await requestPromise;

        expect(result.id).toBe(123);
        expect(result.symbol).toBe('BTC');
    });

    it('should POST when saving a new coin (no ID)', async () => {
        const newCoin = { name: 'Ethereum', symbol: 'ETH' };
        const mockResponse = { success: true };

        const requestPromise = firstValueFrom(service.save(newCoin as any));

        const req = httpMock.expectOne(apiUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ id: undefined, nome: 'Ethereum', moeda: 'ETH' });

        req.flush(mockResponse);
        await requestPromise;
    });

    it('should PUT when saving an existing coin (with ID)', async () => {
        const existingCoin: ICoinModel = { id: 50, name: 'Solana', symbol: 'SOL' };

        const requestPromise = firstValueFrom(service.save(existingCoin));

        const req = httpMock.expectOne(`${apiUrl}/50`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body.moeda).toBe('SOL');

        req.flush({ success: true });
        await requestPromise;
    });

    it('should DELETE a coin by ID', async () => {
        const coinId = 99;

        const requestPromise = firstValueFrom(service.delete(coinId));

        const req = httpMock.expectOne(`${apiUrl}/99`);
        expect(req.request.method).toBe('DELETE');

        req.flush({});
        await requestPromise;
    });

    it('should correctly map DTO to Model', () => {
        const dto = { id: 1, nome: 'Euro', moeda: 'EUR' };
        const model = service.mapModel(dto as any);

        expect(model.name).toBe('Euro');
        expect(model.symbol).toBe('EUR');
    });

    it('should correctly map Model to DTO', () => {
        const model = { id: 2, name: 'Litecoin', symbol: 'LTC' };
        const dto = service.mapDto(model as any);

        expect(dto.nome).toBe('Litecoin');
        expect(dto.moeda).toBe('LTC');
    });
});
