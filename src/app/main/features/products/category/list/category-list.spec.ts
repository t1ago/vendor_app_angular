import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { PageLoadingService } from '@shared/components/page-loading/services/page-loading-service';
import { ToastService } from '@shared/components/toast/services/toast-service';
import { IMAGES } from '@shared/constants/images';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ICategoryModel } from '../interfaces/category-model';
import { CategoryService } from '../services/category-service';
import { CategoryList } from './category-list';

describe('CategoryList', () => {
    let component: CategoryList;
    let categoryServiceMock: any;
    let toastServiceMock: any;
    let pageLoadingServiceMock: any;
    let routerMock: any;
    let activatedRouteMock: any;

    const mockCategories: ICategoryModel[] = [
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Books' },
    ];

    beforeEach(async () => {
        categoryServiceMock = {
            getAll: vi.fn().mockReturnValue(of(mockCategories)),
            delete: vi.fn().mockReturnValue(of({})),
        };

        toastServiceMock = {
            show: vi.fn(),
        };

        pageLoadingServiceMock = {
            show: vi.fn(),
            hide: vi.fn(),
        };

        routerMock = {
            navigate: vi.fn(),
        };

        activatedRouteMock = {
            data: of({ data: mockCategories }),
        };

        await TestBed.configureTestingModule({
            imports: [CategoryList],
            providers: [
                { provide: CategoryService, useValue: categoryServiceMock },
                { provide: ToastService, useValue: toastServiceMock },
                { provide: PageLoadingService, useValue: pageLoadingServiceMock },
                { provide: Router, useValue: routerMock },
                { provide: ActivatedRoute, useValue: activatedRouteMock },
            ],
        }).compileComponents();

        component = TestBed.createComponent(CategoryList).componentInstance;
    });

    it('should create the component and initialize with route data', () => {
        expect(component).toBeTruthy();
        expect(component.title).toBe('Lista de Categorias');
        expect(component.model()).toEqual(mockCategories);
    });

    it('should return table configuration correctly', () => {
        const config = component.getTableConfig();

        expect(config.hasHover).toBe(true);
        expect(config.titles[0].name).toBe('Nome da Categoria');
        expect(config.titles[0].dataField).toBe('name');
        expect(config.buttons.length).toBe(2);
        expect(component.buttonAddIcon).toBe(IMAGES.NEW);
    });

    it('should navigate to form for editing when onEditAction is triggered', () => {
        const category = mockCategories[0];
        component.onEditAction(category);
        expect(routerMock.navigate).toHaveBeenCalledWith(['category', 'form', category.id]);
    });

    it('should navigate to form for adding when onAddAction is triggered', () => {
        component.onAddAction();
        expect(routerMock.navigate).toHaveBeenCalledWith(['category', 'form']);
    });

    it('should update model when onRefreshAction is triggered', () => {
        const newData: ICategoryModel[] = [{ id: 3, name: 'Games' }];
        categoryServiceMock.getAll.mockReturnValue(of(newData));

        component.onRefreshAction();

        expect(categoryServiceMock.getAll).toHaveBeenCalled();
        expect(component.model()).toEqual(newData);
    });

    describe('onRemoveAction', () => {
        it('should remove record successfully, call callback and show success toast', () => {
            const category = mockCategories[0];
            const callback = vi.fn();

            categoryServiceMock.delete.mockReturnValue(of({}));

            component.onRemoveAction(category, callback);

            expect(categoryServiceMock.delete).toHaveBeenCalledWith(category.id);
            expect(callback).toHaveBeenCalled();
            expect(toastServiceMock.show).toHaveBeenCalledWith('Registro removido com sucesso', 'success');
        });

        it('should show danger toast when deletion fails', () => {
            const category = mockCategories[0];
            const errorResponse = { message: 'Error deleting record' };

            categoryServiceMock.delete.mockReturnValue(throwError(() => errorResponse));

            component.onRemoveAction(category, vi.fn());

            expect(toastServiceMock.show).toHaveBeenCalledWith(errorResponse.message, 'danger');
        });
    });

    it('should trigger table button actions', () => {
        const config = component.getTableConfig();
        const editSpy = vi.spyOn(component, 'onEditAction');
        const removeSpy = vi.spyOn(component, 'onRemoveAction');
        const category = mockCategories[0];

        config.buttons[0].action(category);
        expect(editSpy).toHaveBeenCalledWith(category);

        config.buttons[1].action(category);
        expect(removeSpy).toHaveBeenCalledWith(category, component.onRefreshAction);
    });
});
