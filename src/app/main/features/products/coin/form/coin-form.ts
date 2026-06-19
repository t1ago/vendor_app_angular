import { Component, inject, OnInit } from '@angular/core';
import { maxLength, minLength, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BaseForm } from '@shared/classes/base-form';
import { PageLoading } from '@shared/components/page-loading/page-loading';
import { InputField } from '@shared/components/input-field/input-field';
import { ToastService } from '@shared/components/toast/services/toast-service';
import { ISateSaveControlModel } from '@shared/interfaces/save-control-model';
import { ICoinModel } from '../interfaces/coin-model';
import { CoinService } from '../services/coin-service';

@Component({
    selector: 'app-coin-form',
    imports: [InputField, PageLoading, TranslatePipe],
    templateUrl: './coin-form.html',
    styleUrl: './coin-form.scss',
})
export class CoinForm extends BaseForm<ICoinModel, CoinService> implements OnInit {
    override service = inject(CoinService);

    private router = inject(Router);

    private route = inject(ActivatedRoute);

    private toastService = inject(ToastService);

    private translate = inject(TranslateService);

    constructor() {
        super();
        this.createForm(this.makeEmptyModel(), (schemaPath: any) => {
            required(schemaPath.name, { message: 'MAIN.FEATURES.COIN.VALIDATION.NAMEREQUIRED' });
            minLength(schemaPath.name, 3, { message: 'MAIN.FEATURES.COIN.VALIDATION.NAMEMINLENGTH' });
            required(schemaPath.symbol, { message: 'MAIN.FEATURES.COIN.VALIDATION.SYMBOLREQUIRED' });
            maxLength(schemaPath.symbol, 3, { message: 'MAIN.FEATURES.COIN.VALIDATION.SYMBOLMAXLENGTH' });
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
            const coin = this.model();

            this.updateSaveControl(
                ISateSaveControlModel.SAVING,
                coin.id == null
                    ? this.translate.instant('COMMONS.SAVING')
                    : this.translate.instant('COMMONS.UPDATING')
            );

            this.toastService.show(this.saveControl().message, 'info');

            this.service.save(coin).subscribe({
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
        this.router.navigate(['coin', 'list']);
    }

    private makeEmptyModel(): ICoinModel {
        return { id: null, name: '', symbol: '' };
    }

    get formName() {
        return this.formData.name;
    }

    get formSymbol() {
        return this.formData.symbol;
    }
}
