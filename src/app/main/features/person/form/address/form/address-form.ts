import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { disabled, pattern, required } from '@angular/forms/signals';
import { IAddressEvent } from '@features/person/interfaces/address-event';
import { IAddressStateModel } from '@features/person/interfaces/address-state.model';
import { AddressType, IAddressModel } from '@features/person/interfaces/address.model';
import { AddressService } from '@features/person/services/address-service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BaseForm } from '@shared/classes/base-form';
import { InputField } from '@shared/components/input-field/input-field';
import { IInputFieldOption } from '@shared/components/input-field/interfaces/input-field-option';

const PATTERNS = {
    CEP: /^\d{5}-\d{3}$/,
};

@Component({
    selector: 'app-address-form',
    imports: [InputField, TranslatePipe],
    templateUrl: './address-form.html',
    styleUrl: './address-form.scss',
})
export class AddressForm extends BaseForm<IAddressModel, null> implements OnInit {
    addressService = inject(AddressService);

    translateService = inject(TranslateService);

    addressEvent = input<IAddressEvent | null>(null);

    onSave = output<IAddressEvent>();

    onCancel = output<void>();

    states = signal<IAddressStateModel[]>([]);

    stateOptions = computed<IInputFieldOption[]>(() => {
        return this.states().map((state) => {
            return {
                value: state.abbreviation,
                label: state.name,
            } as IInputFieldOption;
        });
    });

    typeOptions = computed<IInputFieldOption[]>(() => [
        { value: 'M' as AddressType, label: this.typeContentValueLabel('M') },
        { value: 'E' as AddressType, label: this.typeContentValueLabel('E') },
        { value: 'C' as AddressType, label: this.typeContentValueLabel('C') },
    ]);

    lockedByZipCode = signal<boolean>(false);

    ADDRESS_TYPE_LABEL: Record<AddressType, string> = {
        M: this.translateService.instant('MAIN.FEATURES.ADDRESS.ADDRESSTYPERESIDENTIAL'),
        C: this.translateService.instant('MAIN.FEATURES.ADDRESS.ADDRESSTYPEBILLING'),
        E: this.translateService.instant('MAIN.FEATURES.ADDRESS.ADDRESSTYPEDELIVERY'),
    };

    constructor() {
        super();

        this.createForm(this.createModel(), (schemaPath: any) => {
            required(schemaPath.zipCode, { message: 'MAIN.FEATURES.ADDRESS.VALIDATION.ZIPCODEREQUIRED' });
            pattern(schemaPath.zipCode, PATTERNS.CEP, { message: 'MAIN.FEATURES.ADDRESS.VALIDATION.ZIPCODEINVALID' });
            required(schemaPath.street, { message: 'MAIN.FEATURES.ADDRESS.VALIDATION.STREETREQUIRED' });
            required(schemaPath.neighborhood, { message: 'MAIN.FEATURES.ADDRESS.VALIDATION.NEIGHBORHOODREQUIRED' });
            required(schemaPath.city, { message: 'MAIN.FEATURES.ADDRESS.VALIDATION.CITYREQUIRED' });
            required(schemaPath.state, { message: 'MAIN.FEATURES.ADDRESS.VALIDATION.STATEREQUIRED' });
            disabled(schemaPath.street, () => this.isDisabledByZipCode);
            disabled(schemaPath.neighborhood, () => this.isDisabledByZipCode);
            disabled(schemaPath.city, () => this.isDisabledByZipCode);
            disabled(schemaPath.state, () => this.isDisabledByZipCode);
        });
    }

    ngOnInit(): void {
        if (this.addressEvent()) {
            this.model.set(this.addressEvent()!.address);
            this.lockedByZipCode.set(this.addressEvent()!.address.searchByZipCode);
        }

        this.addressService.getStates().subscribe((result) => {
            this.states.set(result);
        });
    }

    onZipCodeBlur(): void {
        const zipCode = this.formZipCode().value();

        if (!zipCode || !PATTERNS.CEP.test(zipCode)) {
            this.clearZipCodeFields();
            return;
        }

        this.addressService.getByZipCode(zipCode).subscribe({
            next: (result) => {
                if (!result.zipCode) {
                    this.clearZipCodeFields();
                    return;
                }

                this.model.update((m) => ({
                    ...m,
                    street: result.street,
                    neighborhood: result.neighborhood,
                    city: result.city,
                    state: result.state.abbreviation,
                    searchByZipCode: true,
                }));

                this.lockedByZipCode.set(true);
            },
            error: () => {
                this.clearZipCodeFields();
            },
        });
    }

    private clearZipCodeFields(): void {
        this.model.update((m) => ({
            ...m,
            street: '',
            neighborhood: '',
            city: '',
            state: '',
            searchByZipCode: false,
        }));

        this.lockedByZipCode.set(false);
    }

    override onSaveAction(): void {
        this.onSave.emit({
            address: this.model(),
            index: this.addressEvent() ? this.addressEvent()!.index : null,
        });
    }

    override onCancelAction(): void {
        this.onCancel.emit();
    }

    private createModel(): IAddressModel {
        return {
            id: null,
            zipCode: '',
            street: '',
            number: '',
            neighborhood: '',
            city: '',
            state: '',
            type: 'M',
            searchByZipCode: false,
            active: true,
        };
    }

    get isDisabledByZipCode() {
        return this.lockedByZipCode();
    }

    get formZipCode() {
        return this.formData.zipCode;
    }

    get formStreet() {
        return this.formData.street;
    }

    get formNumber() {
        return this.formData.number;
    }

    get formNeighborhood() {
        return this.formData.neighborhood;
    }

    get formCity() {
        return this.formData.city;
    }

    get formState() {
        return this.formData.state;
    }

    get formType() {
        return this.formData.type;
    }

    get statesValue() {
        return this.states();
    }

    typeContentValueLabel(type: AddressType) {
        return this.ADDRESS_TYPE_LABEL[type];
    }
}
