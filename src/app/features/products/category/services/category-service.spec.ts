import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { CategoryService } from './category-service';
import { ICategoryDto } from '../interfaces/category-dto';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ICategoryModel } from '../interfaces/category-model';
import { firstValueFrom } from 'rxjs';

describe('CategoryService', () => {
    let service: CategoryService;
    let httpMock: HttpTestingController;
    const apiUrl = 'http://localhost:3000/categorias';

    const mockDtoResponse: { data: ICategoryDto[] } = {
        data: [
            { id: 1, nome: 'Eletrônicos' },
            { id: 2, nome: 'Livros' }
        ]
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CategoryService,
                provideHttpClient(),
                provideHttpClientTesting(),
            ],
        });

        service = TestBed.inject(CategoryService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch all categories and map them to ICategoryModel[]', async () => {
        const mockResponse: { data: ICategoryDto[] } = {
            data: [
                { id: 1, nome: 'Electronics' },
                { id: 2, nome: 'Books' }
            ]
        };

        const requestPromise = firstValueFrom(service.getAll());

        const req = httpMock.expectOne(apiUrl);
        req.flush(mockResponse);

        const models = await requestPromise;

        expect(req.request.method).toBe('GET');
        expect(models.length).toBe(2);
        expect(models[0].name).toBe('Electronics');
    });
});
