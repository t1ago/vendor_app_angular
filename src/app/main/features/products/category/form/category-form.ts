import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormField, minLength, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseForm } from '@shared/classes/base-form';
import { ToastService } from '@shared/components/toast/services/toast-service';
import { ISateSaveControlModel } from '@shared/interfaces/save-control-model';
import { ICategoryModel } from '../interfaces/category-model';
import { CategoryService } from '../services/category-service';

@Component({
    selector: 'app-category-form',
    imports: [FormField],
    templateUrl: './category-form.html',
    styleUrl: './category-form.scss',
})
export class CategoryForm extends BaseForm<ICategoryModel, CategoryService> {
    override service = inject(CategoryService);

    private router = inject(Router);

    private route = inject(ActivatedRoute);

    private toastService = inject(ToastService);

    constructor() {
        super();
        this.createForm(this.createModel(), (schemaPath: any) => {
            (required(schemaPath.name, { message: 'Nome é obrigatório' }),
                minLength(schemaPath.name, 3, { message: 'Nome deve ter 3 caracteres' }));
        });
    }

    private createModel(): ICategoryModel {
        const routeData = toSignal(this.route.data);
        const dataModel = routeData()?.['data'];

        if (dataModel) {
            return dataModel as ICategoryModel;
        } else {
            return {
                id: null,
                name: '',
            };
        }
    }

    override onSaveAction() {
        submit(this.formData, async () => {
            const category = this.model();

            this.updateSaveControl(
                ISateSaveControlModel.SAVING,
                category.id == null ? 'Salvando categoria' : 'Atualizando categoria'
            );

            this.toastService.show(this.saveControl().message, 'info');

            this.service.save(category).subscribe({
                next: () => {
                    this.toastService.show('Registro salvo com sucesso', 'success', 1000);
                    this.updateSaveControl(ISateSaveControlModel.OPEN, '');
                    this.onCancelAction();
                },
                error: (_errorData) => {
                    this.toastService.show('Falha ao salvar o registro', 'danger');
                },
            });
        });
    }

    override onCancelAction(): void {
        this.router.navigate(['category', 'list']);
    }

    get formName() {
        return this.formData.name;
    }
}
