import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToastService } from '@shared/components/toast/services/toast-service';
import { of, throwError } from 'rxjs';
import { Mocked } from 'vitest';
import { Login } from './login';
import { LoginService } from './services/login-service';

describe('Login', () => {
    let component: Login;
    let fixture: ComponentFixture<Login>;

    const loginServiceStub: Partial<Mocked<LoginService>> = {
        login: vi.fn(),
    };

    const toastServiceStub: Partial<Mocked<ToastService>> = {
        show: vi.fn(),
    };

    beforeEach(() => {
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            imports: [Login],
            providers: [
                provideRouter([]),
                { provide: LoginService, useValue: loginServiceStub },
                { provide: ToastService, useValue: toastServiceStub },
            ],
        });

        fixture = TestBed.createComponent(Login);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should render login form', () => {
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;

        expect(compiled.querySelector('#email')).toBeTruthy();
        expect(compiled.querySelector('#password')).toBeTruthy();
        expect(compiled.querySelector('button')).toBeTruthy();
    });

    it('should show email validation errors when invalid and touched', () => {
        // GIVEN
        component.formEmail().value.set('');
        component.formEmail().markAsTouched();

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const errors = compiled.querySelectorAll('.text-danger small');

        // THEN
        expect(errors.length).toBeGreaterThan(0);
        expect(compiled.textContent).toContain('E-mail é obrigatório');
    });

    it('should show password validation errors when invalid and touched', () => {
        // GIVEN
        component.formPassword().value.set('123');
        component.formPassword().markAsTouched();

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const errors = compiled.querySelectorAll('.text-danger small');

        // THEN
        expect(errors.length).toBeGreaterThan(0);
        expect(compiled.textContent).toContain('A senha deve ter no mínimo 6 caracteres');
    });

    it('should disable button when form is invalid', () => {
        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector('button');

        expect(button.disabled).toBeTruthy();
    });

    it('should call login service and navigate on success', () => {
        // GIVEN
        const navigateSpy = vi.spyOn((component as any).router, 'navigate');

        loginServiceStub.login?.mockReturnValue(of(true));

        component.formEmail().value.set('test@email.com');
        component.formPassword().value.set('123456');

        component.formEmail().markAsTouched();
        component.formPassword().markAsTouched();

        fixture.detectChanges();

        // WHEN
        component.onSign();

        // THEN
        expect(loginServiceStub.login).toHaveBeenCalled();
        expect(navigateSpy).toHaveBeenCalledWith(['/home']);
    });

    it('should show toast on login error', () => {
        // GIVEN
        loginServiceStub.login?.mockReturnValue(throwError(() => ({ error: 'Invalid' })));

        component.formEmail().value.set('test@email.com');
        component.formPassword().value.set('123456');

        component.formEmail().markAsTouched();
        component.formPassword().markAsTouched();

        fixture.detectChanges();

        // WHEN
        component.onSign();

        // THEN
        expect(loginServiceStub.login).toHaveBeenCalled();
        expect(toastServiceStub.show).toHaveBeenCalledWith('Usuário ou senha inválidos', 'danger');
    });

    it('should show loading spinner when saving', () => {
        // GIVEN
        vi.spyOn(component as any, 'isSaveAction', 'get').mockReturnValue(true);

        // WHEN
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const spinner = compiled.querySelector('.spinner-border');

        // THEN
        expect(spinner).toBeTruthy();
    });

    it('should call onSign when button is clicked', () => {
        // GIVEN
        const onSignSpy = vi.spyOn(component, 'onSign');

        // deixa o form válido → botão habilita
        component.formEmail().value.set('test@email.com');
        component.formPassword().value.set('123456');

        component.formEmail().markAsTouched();
        component.formPassword().markAsTouched();

        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector('button');

        // sanity check (opcional, mas útil)
        expect(button.disabled).toBeFalsy();

        // WHEN
        button.click();

        // THEN
        expect(onSignSpy).toHaveBeenCalled();
    });
});
