import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@shared/components/toast/services/toast-service';
import { of, throwError } from 'rxjs';
import { Mocked } from 'vitest';
import { CategoryService } from '../services/category-service';
import { CategoryForm } from './category-form';

describe('CategoryForm', () => {
    let component: CategoryForm;
    let fixture: ComponentFixture<CategoryForm>;

    const categoryServiceStub: Partial<Mocked<CategoryService>> = {
        save: vi.fn(),
    };

    const toastServiceStub: Partial<Mocked<ToastService>> = {
        show: vi.fn(),
    };

    const translateServiceStub = {
        instant: vi.fn((key: string) => key),
    };

    const routerStub = {
        navigate: vi.fn(),
    };

    const activatedRouteStub = {
        snapshot: { data: {} },
    };

    beforeEach(() => {
        TestBed.resetTestingModule();

        categoryServiceStub.save = vi.fn().mockReturnValue(of({}));

        TestBed.configureTestingModule({
            imports: [CategoryForm],
            providers: [
                provideRouter([]),
                { provide: Router, useValue: routerStub },
                { provide: CategoryService, useValue: categoryServiceStub },
                { provide: ToastService, useValue: toastServiceStub },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: TranslateService, useValue: translateServiceStub },
            ],
        });

        fixture = TestBed.createComponent(CategoryForm);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should render form input', () => {
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;

        expect(compiled.querySelector('#name')).toBeTruthy();
        expect(compiled.querySelectorAll('button').length).toBe(2);
    });

    it('should disable save button when form is invalid', () => {
        fixture.detectChanges();

        const button = fixture.nativeElement.querySelectorAll('button')[1];

        expect(button.disabled).toBeTruthy();
    });

    it('should call onCancelAction when cancel button is clicked', () => {
        const spy = vi.spyOn(component, 'onCancelAction');

        fixture.detectChanges();

        const button = fixture.nativeElement.querySelectorAll('button')[0];
        button.click();

        expect(spy).toHaveBeenCalled();
    });

    it('should call onSaveAction when save button is clicked', () => {
        const spy = vi.spyOn(component, 'onSaveAction');

        component.formName().value.set('Teste');
        component.formName().markAsTouched();

        fixture.detectChanges();

        const button = fixture.nativeElement.querySelectorAll('button')[1];

        expect(button.disabled).toBeFalsy();

        button.click();

        expect(spy).toHaveBeenCalled();
    });

    it('should call service.save and navigate on success', () => {
        categoryServiceStub.save?.mockReturnValue(of({}));

        component.formName().value.set('Teste');
        component.formName().markAsTouched();

        fixture.detectChanges();

        component.onSaveAction();

        expect(categoryServiceStub.save).toHaveBeenCalled();
        expect(toastServiceStub.show).toHaveBeenCalledWith('COMMONS.RECORDSAVEDWITHSUCCESS', 'success', 1000);
        expect(routerStub.navigate).toHaveBeenCalledWith(['category', 'list']);
    });

    it('should show error toast when save fails', () => {
        categoryServiceStub.save?.mockReturnValue(throwError(() => ({})));

        component.formName().value.set('Teste');
        component.formName().markAsTouched();

        fixture.detectChanges();

        component.onSaveAction();

        expect(categoryServiceStub.save).toHaveBeenCalled();
        expect(toastServiceStub.show).toHaveBeenCalledWith('COMMONS.FAILSTOSAVERECORD', 'danger');
    });

    it('should show loading spinner when saving', () => {
        vi.spyOn(component as any, 'isSaveAction', 'get').mockReturnValue(true);

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const spinner = compiled.querySelector('.spinner-border');

        expect(spinner).toBeTruthy();
    });

    it('should initialize form with route data when editing', () => {
        const activatedRouteWithData = {
            snapshot: { data: { data: { id: 10, name: 'Categoria Editar' } } },
        };

        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            imports: [CategoryForm],
            providers: [
                provideRouter([]),
                { provide: Router, useValue: routerStub },
                { provide: CategoryService, useValue: categoryServiceStub },
                { provide: ToastService, useValue: toastServiceStub },
                { provide: ActivatedRoute, useValue: activatedRouteWithData },
                { provide: TranslateService, useValue: translateServiceStub },
            ],
        });

        const fixture = TestBed.createComponent(CategoryForm);
        const component = fixture.componentInstance;

        fixture.detectChanges();

        expect(component.model().id).toBe(10);
        expect(component.model().name).toBe('Categoria Editar');
    });

    it('should use COMMONS.UPDATING message when id exists', () => {
        categoryServiceStub.save?.mockReturnValue(of({}));

        component.formName().value.set('Categoria Editar');
        component.formName().markAsTouched();

        component.model.set({ id: 1, name: 'Categoria Editar' });

        const updateSpy = vi.spyOn(component, 'updateSaveControl');

        fixture.detectChanges();

        component.onSaveAction();

        expect(updateSpy).toHaveBeenCalledWith(expect.anything(), 'COMMONS.UPDATING');
    });
});
