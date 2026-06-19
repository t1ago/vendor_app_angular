import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
    let translateServiceMock: any;

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

        translateServiceMock = {
            instant: vi.fn((key: string) => key),
        };

        await TestBed.configureTestingModule({
            imports: [CategoryList],
            providers: [
                { provide: CategoryService, useValue: categoryServiceMock },
                { provide: ToastService, useValue: toastServiceMock },
                { provide: PageLoadingService, useValue: pageLoadingServiceMock },
                { provide: Router, useValue: routerMock },
                { provide: ActivatedRoute, useValue: activatedRouteMock },
                { provide: TranslateService, useValue: translateServiceMock },
            ],
        }).compileComponents();

        component = TestBed.createComponent(CategoryList).componentInstance;
    });

    it('should create the component and initialize with route data', () => {
        expect(component).toBeTruthy();
        expect(component.title).toBe('MAIN.FEATURES.CATEGORY.TITLE');
        expect(component.model()).toEqual(mockCategories);
    });

    it('should return table configuration correctly', () => {
        const config = component.getTableConfig();

        expect(config.hasHover).toBe(true);
        expect(config.titles[0].name).toBe('MAIN.FEATURES.CATEGORY.NAME');
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

    describe('onRemoveAction', () => {
        it('should remove record from model signal and show success toast', () => {
            const category = mockCategories[0];

            categoryServiceMock.delete.mockReturnValue(of({}));

            component.onRemoveAction(category, null);

            expect(categoryServiceMock.delete).toHaveBeenCalledWith(category.id);
            expect(component.model()).not.toContainEqual(category);
            expect(toastServiceMock.show).toHaveBeenCalledWith('COMMONS.RECORDREMOVEDWITHSUCCESS', 'success');
        });

        it('should show danger toast when deletion fails', () => {
            const category = mockCategories[0];
            const errorResponse = { message: 'Error deleting record' };

            categoryServiceMock.delete.mockReturnValue(throwError(() => errorResponse));

            component.onRemoveAction(category, null);

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
        expect(removeSpy).toHaveBeenCalledWith(category, null);
    });
});
