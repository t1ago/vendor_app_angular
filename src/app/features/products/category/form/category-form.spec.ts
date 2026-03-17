import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CategoryForm } from './category-form';
import { CategoryService } from '../services/category-service';
import { ToastService } from '@shared/components/toast/services/toast-service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { ISateSaveControl } from '@shared/interfaces/save-control';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

describe('CategoryForm', () => {
    let component: CategoryForm;
    let fixture: ComponentFixture<CategoryForm>;
    const routeDataSubject = new BehaviorSubject<any>({});

    const mockCategoryService = { save: vi.fn() };
    const mockToastService = { show: vi.fn() };
    const mockRouter = { navigate: vi.fn() };
    const mockActivatedRoute = { data: routeDataSubject.asObservable() };

    beforeEach(async () => {
        vi.clearAllMocks();
        routeDataSubject.next({});

        await TestBed.configureTestingModule({
            imports: [CategoryForm],
            providers: [
                { provide: CategoryService, useValue: mockCategoryService },
                { provide: ToastService, useValue: mockToastService },
                { provide: Router, useValue: mockRouter },
                { provide: ActivatedRoute, useValue: mockActivatedRoute }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CategoryForm);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create and initialize with default model (Branch: else dataModel)', () => {
        expect(component).toBeTruthy();
        expect(component.formName().value()).toBe('');
        expect(component.model().id).toBeNull();
    });

    it('should initialize with route data when present (Branch: if dataModel)', () => {
        const mockData = { id: 5, name: 'Eletrônicos' };
        routeDataSubject.next({ data: mockData });

        const editFixture = TestBed.createComponent(CategoryForm);
        const editComponent = editFixture.componentInstance;
        editFixture.detectChanges();

        expect(editComponent.formName().value()).toBe('Eletrônicos');
        expect(editComponent.model().id).toBe(5);
    });

    it('should validate required field', () => {
        component.formName().value.set('');
        fixture.detectChanges();
        const errors = component.formName().errors();

        if (errors.length == 0) {
            expect.fail('Nenhum erro encontrado para teste')
        } else {
            const error = errors[0];
            expect(error.kind).toBe('required')
            expect(error.message).toBe('Nome é obrigatório')
        }
    });

    it('should validate minLength field', () => {
        component.formName().value.set('Ab');
        fixture.detectChanges();
        const errors = component.formName().errors();

        if (errors.length == 0) {
            expect.fail('Nenhum erro encontrado para teste')
        } else {
            const error = errors[0];
            expect(error.kind).toBe('minLength')
            expect(error.message).toBe('Nome deve ter 3 caracteres')
        }
    });

    it('should show "Salvando categoria" toast when id is null', () => {
        component.formName().value.set('Nova Cat');
        mockCategoryService.save.mockReturnValue(of({}));
        component.onSaveAction();
        expect(mockToastService.show).toHaveBeenCalledWith('Salvando categoria', 'info');
    });

    it('should show "Atualizando categoria" toast when id exists', () => {
        routeDataSubject.next({ data: { id: 1, name: 'Teste' } });
        const editFixture = TestBed.createComponent(CategoryForm);
        const editComp = editFixture.componentInstance;
        editFixture.detectChanges();

        mockCategoryService.save.mockReturnValue(of({}));
        editComp.onSaveAction();
        expect(mockToastService.show).toHaveBeenCalledWith('Atualizando categoria', 'info');
    });

    it('should handle success on save: toast, state and navigation', () => {
        component.formName().value.set('Categoria Valida');
        mockCategoryService.save.mockReturnValue(of({}));
        const cancelSpy = vi.spyOn(component, 'onCancelAction');

        component.onSaveAction();

        expect(mockToastService.show).toHaveBeenCalledWith('Registro salvo com sucesso', 'success', 1000);
        expect(component.saveControl().state).toBe(ISateSaveControl.OPEN);
        expect(cancelSpy).toHaveBeenCalled();
    });

    it('should handle error on save: danger toast', () => {
        component.formName().value.set('Categoria Valida');
        mockCategoryService.save.mockReturnValue(throwError(() => new Error('API Error')));

        component.onSaveAction();

        expect(mockToastService.show).toHaveBeenCalledWith('Falha ao salvar o registro', 'danger');
    });

    it('should navigate to list on onCancelAction', () => {
        component.onCancelAction();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['category', 'list']);
    });
});