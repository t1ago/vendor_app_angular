import { Component, inject, OnInit } from '@angular/core';
import { minLength, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BaseForm } from '@shared/classes/base-form';
import { InputField } from '@shared/components/input-field/input-field';
import { PageLoading } from '@shared/components/page-loading/page-loading';
import { ToastService } from '@shared/components/toast/services/toast-service';
import { ISateSaveControlModel } from '@shared/interfaces/save-control-model';
import { IMeasureModel } from '../interfaces/measure-model';
import { MeasureService } from '../services/measure-service';

@Component({
    selector: 'app-measure-form',
    imports: [InputField, PageLoading, TranslatePipe],
    templateUrl: './measure-form.html',
    styleUrl: './measure-form.scss',
})
export class MeasureForm extends BaseForm<IMeasureModel, MeasureService> implements OnInit {
    override service = inject(MeasureService);

    private router = inject(Router);

    private route = inject(ActivatedRoute);

    private toastService = inject(ToastService);

    private translate = inject(TranslateService);

    constructor() {
        super();
        this.createForm(this.makeEmptyModel(), (schemaPath: any) => {
            required(schemaPath.name, { message: 'MAIN.FEATURES.MEASURE.VALIDATION.NAMEREQUIRED' });
            minLength(schemaPath.name, 3, { message: 'MAIN.FEATURES.MEASURE.VALIDATION.NAMEMINLENGTH' });
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
            const measure = this.model();

            this.updateSaveControl(
                ISateSaveControlModel.SAVING,
                measure.id == null
                    ? this.translate.instant('COMMONS.SAVING')
                    : this.translate.instant('COMMONS.UPDATING')
            );

            this.toastService.show(this.saveControl().message, 'info');

            this.service.save(measure).subscribe({
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
        this.router.navigate(['measure', 'list']);
    }

    private makeEmptyModel(): IMeasureModel {
        return { id: null, name: '' };
    }

    get formName() {
        return this.formData.name;
    }
}
