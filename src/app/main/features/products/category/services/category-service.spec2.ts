import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { CategoryService } from './category-service';
import { ICategoryDto } from '../interfaces/category-dto';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

describe('CategoryService', () => {
    let service: CategoryService;
    let httpMock: HttpTestingController;
    const apiUrl = '/tiago/categoria';

    const mockDtoResponse: { data: ICategoryDto[] } = {
        data: [
            { id: 1, nome: 'Eletrônicos' },
            { id: 2, nome: 'Livros' },
        ],
    };

    beforeEach(() => {
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            providers: [CategoryService, provideHttpClient(), provideHttpClientTesting()],
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
                { id: 2, nome: 'Books' },
            ],
        };

        const requestPromise = firstValueFrom(service.getAll());

        const req = httpMock.expectOne(apiUrl);
        req.flush(mockResponse);

        const models = await requestPromise;

        expect(req.request.method).toBe('GET');
        expect(models.length).toBe(2);
        expect(models[0].name).toBe('Electronics');
    });

    it('should fetch a single category by ID and map it to ICategoryModel', async () => {
        const mockResponse = {
            data: [{ id: 1, nome: 'Eletrônicos' }],
        };
        const categoryId = 1;

        const requestPromise = firstValueFrom(service.getById(categoryId));

        const req = httpMock.expectOne(`${apiUrl}/${categoryId}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);

        const model = await requestPromise;

        expect(model.id).toBe(1);
        expect(model.name).toBe('Eletrônicos');
    });

    it('should POST to create a new category when id is missing', async () => {
        const newCategory = { name: 'Casa' };
        const mockResponse = { success: true };

        const requestPromise = firstValueFrom(service.save(newCategory as any));

        const req = httpMock.expectOne(apiUrl);
        expect(req.request.method).toBe('POST');

        expect(req.request.body).toEqual({ id: undefined, nome: 'Casa' });

        req.flush(mockResponse);
        await requestPromise;
    });

    it('should PUT to update an existing category when id is present', async () => {
        const existingCategory = { id: 10, name: 'Ferramentas' };
        const mockResponse = { success: true };

        const requestPromise = firstValueFrom(service.save(existingCategory));

        const req = httpMock.expectOne(`${apiUrl}/${existingCategory.id}`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual({ id: 10, nome: 'Ferramentas' });

        req.flush(mockResponse);
        await requestPromise;
    });

    it('should DELETE a category by ID', async () => {
        const categoryId = 5;
        const mockResponse = {};

        const requestPromise = firstValueFrom(service.delete(categoryId));

        const req = httpMock.expectOne(`${apiUrl}/${categoryId}`);
        expect(req.request.method).toBe('DELETE');

        req.flush(mockResponse);
        await requestPromise;
    });

    it('should correctly map Model to DTO and vice-versa', () => {
        const model = { id: 99, name: 'Teste' };
        const dto = { id: 99, nome: 'Teste' };

        expect(service.mapDto(model)).toEqual(dto);
        expect(service.mapModel(dto)).toEqual(model);
    });
});
