import { Component, inject, OnInit } from '@angular/core';
import { minLength, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BaseForm } from '@shared/classes/base-form';
import { PageLoading } from '@shared/components/page-loading/page-loading';
import { InputField } from '@shared/components/input-field/input-field';
import { ToastService } from '@shared/components/toast/services/toast-service';
import { ISateSaveControlModel } from '@shared/interfaces/save-control-model';
import { ICategoryModel } from '../interfaces/category-model';
import { CategoryService } from '../services/category-service';

@Component({
    selector: 'app-category-form',
    imports: [InputField, PageLoading, TranslatePipe],
    templateUrl: './category-form.html',
    styleUrl: './category-form.scss',
})
export class CategoryForm extends BaseForm<ICategoryModel, CategoryService> implements OnInit {
    override service = inject(CategoryService);

    private router = inject(Router);

    private route = inject(ActivatedRoute);

    private toastService = inject(ToastService);

    private translate = inject(TranslateService);

    constructor() {
        super();
        this.createForm(this.makeEmptyModel(), (schemaPath: any) => {
            required(schemaPath.name, { message: 'MAIN.FEATURES.CATEGORY.VALIDATION.NAMEREQUIRED' });
            minLength(schemaPath.name, 3, { message: 'MAIN.FEATURES.CATEGORY.VALIDATION.NAMEMINLENGTH' });
        });
    }

    ngOnInit(): void {
        const routeData = this.route.snapshot.data['data'];
        if (routeData) {
            this.model.set(routeData);
        }
    }

    override onSaveAction(): void {
        submit(this.formData, async () => {
            const category = this.model();

            this.updateSaveControl(
                ISateSaveControlModel.SAVING,
                category.id == null
                    ? this.translate.instant('COMMONS.SAVING')
                    : this.translate.instant('COMMONS.UPDATING')
            );

            this.toastService.show(this.saveControl().message, 'info');

            this.service.save(category).subscribe({
                next: () => {
                    this.toastService.show(this.translate.instant('COMMONS.RECORDSAVEDWITHSUCCESS'), 'success', 1000);
                    this.updateSaveControl(ISateSaveControlModel.OPEN, '');
                    this.onCancelAction();
                },
                error: () => {
                    this.toastService.show(this.translate.instant('COMMONS.FAILSTOSAVERECORD'), 'danger');
                    this.updateSaveControl(ISateSaveControlModel.OPEN, '');
                },
            });
        });
    }

    override onCancelAction(): void {
        this.router.navigate(['category', 'list']);
    }

    private makeEmptyModel(): ICategoryModel {
        return { id: null, name: '' };
    }

    get formName() {
        return this.formData.name;
    }
}
