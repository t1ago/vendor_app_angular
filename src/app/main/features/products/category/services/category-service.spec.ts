import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ICategoryDto } from '../interfaces/category-dto';
import { CategoryService } from './category-service';

describe('CategoryService', () => {
    let service: CategoryService;
    let httpMock: HttpTestingController;
    const apiUrl = 'http://localhost:3000/tiago/categoria';

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
        // GIVEN
        const categoryDtoMock: { data: ICategoryDto[] } = {
            data: [
                { id: 1, nome: 'Electronics' },
                { id: 2, nome: 'Books' },
            ],
        };

        const gelAllPromise = firstValueFrom(service.getAll());

        const req = httpMock.expectOne(apiUrl);

        // WHEN
        req.flush(categoryDtoMock);

        const models = await gelAllPromise;

        // THEN
        expect(req.request.method).toBe('GET');
        expect(models.length).toBe(2);
        expect(models[0].name).toBe('Electronics');
    });

    it('should fetch a single category by ID and map it to ICategoryModel', async () => {
        // GIVEN
        const categoryDtoMock = {
            data: [{ id: 1, nome: 'Eletrônicos' }],
        };
        const categoryId = 1;

        const getByIdPromise = firstValueFrom(service.getById(categoryId));

        const req = httpMock.expectOne(`${apiUrl}/${categoryId}`);

        // WHEN
        req.flush(categoryDtoMock);

        const model = await getByIdPromise;

        // THEN
        expect(req.request.method).toBe('GET');
        expect(model.id).toBe(1);
        expect(model.name).toBe('Eletrônicos');
    });

    it('should POST to create a new category when id is missing', async () => {
        // GIVEN
        const newCategory = { name: 'Casa' };

        const categoryResult = { success: true };

        const savePromise = firstValueFrom(service.save(newCategory as any));

        const req = httpMock.expectOne(apiUrl);

        // WHEN
        req.flush(categoryResult);

        await savePromise;

        // THEN
        expect(req.request.method).toBe('POST');

        expect(req.request.body).toEqual({ id: undefined, nome: 'Casa' });
    });

    it('should PUT to update an existing category when id is present', async () => {
        // GIVEN
        const existingCategory = { id: 10, name: 'Ferramentas' };

        const categoryResult = { success: true };

        const savePromise = firstValueFrom(service.save(existingCategory));

        const req = httpMock.expectOne(`${apiUrl}/${existingCategory.id}`);

        // WHEN
        req.flush(categoryResult);

        await savePromise;

        // THEN
        expect(req.request.method).toBe('PUT');

        expect(req.request.body).toEqual({ id: 10, nome: 'Ferramentas' });
    });

    it('should DELETE a category by ID', async () => {
        // GIVEN
        const categoryId = 5;

        const categoryResult = {};

        const deletePromise = firstValueFrom(service.delete(categoryId));

        const req = httpMock.expectOne(`${apiUrl}/${categoryId}`);

        // WHEN
        req.flush(categoryResult);

        await deletePromise;

        // THEN
        expect(req.request.method).toBe('DELETE');
    });

    it('should correctly map Model to DTO and DTO tp Model', () => {
        // GIVEN
        const model = { id: 99, name: 'Test' };

        const dto = { id: 99, nome: 'Test' };

        // WHEN - THEN
        expect(service.mapDto(model)).toEqual(dto);

        expect(service.mapModel(dto)).toEqual(model);
    });
});
