import { Component, inject } from '@angular/core';
import { email, FormField, minLength, required, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { BaseForm } from '@shared/classes/base-form';
import { ToastService } from '@shared/components/toast/services/toast-service';
import { ISateSaveControlModel } from '@shared/interfaces/save-control-model';
import { IAuthLoginModel } from '../shared/interfaces/auth-login-model';
import { LoginService } from './services/login-service';

@Component({
    selector: 'app-login',
    imports: [FormField],
    templateUrl: './login.html',
    styleUrl: './login.scss',
})
export class Login extends BaseForm<IAuthLoginModel, LoginService> {
    override service = inject(LoginService);

    private router = inject(Router);

    private toastService = inject(ToastService);

    constructor() {
        super();
        this.createForm(this.createModel(), (schemaPath: any) => {
            (required(schemaPath.email, { message: 'E-mail é obrigatório' }),
                email(schemaPath.email, { message: 'Insira um e-mail válido' }),
                required(schemaPath.password, { message: 'A senha é obrigatória' }),
                minLength(schemaPath.password, 6, { message: 'A senha deve ter no mínimo 6 caracteres' }));
        });
    }

    private createModel(): IAuthLoginModel {
        return {
            email: '',
            password: '',
        };
    }

    onSign() {
        submit(this.formData, async () => {
            const loginData = this.model();

            this.updateSaveControl(ISateSaveControlModel.SAVING, 'Autenticando');

            this.service.login(loginData).subscribe({
                next: (response) => {
                    this.updateSaveControl(ISateSaveControlModel.OPEN, '');
                    this.router.navigate(['/home']);
                },
                error: (err) => {
                    this.updateSaveControl(ISateSaveControlModel.OPEN, '');
                    this.toastService.show('Usuário ou senha inválidos', 'danger');
                },
            });
        });
    }

    get formEmail() {
        return this.formData.email;
    }

    get formPassword() {
        return this.formData.password;
    }
}
