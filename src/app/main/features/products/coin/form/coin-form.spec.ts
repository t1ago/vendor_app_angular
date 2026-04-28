import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ToastService } from '@shared/components/toast/services/toast-service';
import { of, throwError } from 'rxjs';
import { Mocked } from 'vitest';
import { CoinService } from '../services/coin-service';
import { CoinForm } from './coin-form';

describe('CoinForm', () => {
    let component: CoinForm;
    let fixture: ComponentFixture<CoinForm>;

    const coinServiceStub: Partial<Mocked<CoinService>> = {
        save: vi.fn(),
    };

    const toastServiceStub: Partial<Mocked<ToastService>> = {
        show: vi.fn(),
    };

    const routerStub = {
        navigate: vi.fn(),
    };

    const activatedRouteStub = {
        data: of({}),
    };

    beforeEach(() => {
        TestBed.resetTestingModule();

        coinServiceStub.save = vi.fn().mockReturnValue(of({}));

        TestBed.configureTestingModule({
            imports: [CoinForm],
            providers: [
                provideRouter([]),
                { provide: Router, useValue: routerStub },
                { provide: CoinService, useValue: coinServiceStub },
                { provide: ToastService, useValue: toastServiceStub },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
            ],
        });

        fixture = TestBed.createComponent(CoinForm);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should render inputs', () => {
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;

        expect(compiled.querySelector('#name')).toBeTruthy();
        expect(compiled.querySelector('#simbol')).toBeTruthy();
    });

    it('should show validation errors for name and symbol', () => {
        component.formName().value.set('');
        component.formName().markAsTouched();

        component.formSymbol().value.set('');
        component.formSymbol().markAsTouched();

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;

        expect(compiled.textContent).toContain('Nome da Moeda é obrigatório');
        expect(compiled.textContent).toContain('Símbolo é obrigatório');
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

        component.formName().value.set('Bitcoin');
        component.formName().markAsTouched();

        component.formSymbol().value.set('BTC');
        component.formSymbol().markAsTouched();

        fixture.detectChanges();

        const button = fixture.nativeElement.querySelectorAll('button')[1];

        expect(button.disabled).toBeFalsy();

        button.click();

        expect(spy).toHaveBeenCalled();
    });

    it('should call service.save and navigate on success', () => {
        coinServiceStub.save?.mockReturnValue(of({}));

        component.formName().value.set('Bitcoin');
        component.formSymbol().value.set('BTC');

        component.formName().markAsTouched();
        component.formSymbol().markAsTouched();

        fixture.detectChanges();

        component.onSaveAction();

        expect(coinServiceStub.save).toHaveBeenCalled();
        expect(toastServiceStub.show).toHaveBeenCalledWith('Registro salvo com sucesso', 'success', 1000);
        expect(routerStub.navigate).toHaveBeenCalledWith(['coin', 'list']);
    });

    it('should show error toast when save fails', () => {
        coinServiceStub.save?.mockReturnValue(throwError(() => ({})));

        component.formName().value.set('Bitcoin');
        component.formSymbol().value.set('BTC');

        component.formName().markAsTouched();
        component.formSymbol().markAsTouched();

        fixture.detectChanges();

        component.onSaveAction();

        expect(coinServiceStub.save).toHaveBeenCalled();
        expect(toastServiceStub.show).toHaveBeenCalledWith('Falha ao salvar o registro', 'danger');
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
            data: of({
                data: { id: 1, name: 'Bitcoin', symbol: 'BTC' },
            }),
        };

        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            imports: [CoinForm],
            providers: [
                provideRouter([]),
                { provide: Router, useValue: routerStub },
                { provide: CoinService, useValue: coinServiceStub },
                { provide: ToastService, useValue: toastServiceStub },
                { provide: ActivatedRoute, useValue: activatedRouteWithData },
            ],
        });

        const fixture = TestBed.createComponent(CoinForm);
        const component = fixture.componentInstance;

        fixture.detectChanges();

        expect(component.model().id).toBe(1);
        expect(component.model().name).toBe('Bitcoin');
        expect(component.model().symbol).toBe('BTC');
    });

    it('should use "Atualizando moeda" message when id exists', () => {
        coinServiceStub.save?.mockReturnValue(of({}));

        component.model.set({
            id: 1,
            name: 'Bitcoin',
            symbol: 'BTC',
        });

        const spy = vi.spyOn(component, 'updateSaveControl');

        fixture.detectChanges();

        component.onSaveAction();

        expect(spy).toHaveBeenCalledWith(expect.anything(), 'Atualizando moeda');
    });
});
