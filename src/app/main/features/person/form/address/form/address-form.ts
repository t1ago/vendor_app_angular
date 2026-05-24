import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormField, pattern, required } from '@angular/forms/signals';
import { IAddressStateModel } from '@features/person/interfaces/address-state.model';
import { ADDRESS_TYPE_LABEL, AddressType, IAddressModel } from '@features/person/interfaces/address.model';
import { AddressService } from '@features/person/services/address-service';
import { BaseForm } from '@shared/classes/base-form';

const PATTERNS = {
    CEP: /^\d{5}-\d{3}$/,
};

@Component({
    selector: 'app-address-form',
    imports: [FormField],
    templateUrl: './address-form.html',
    styleUrl: './address-form.scss',
})
export class AddressForm extends BaseForm<IAddressModel, null> implements OnInit {
    addressService = inject(AddressService);

    onSave = output<IAddressModel>();

    onCancel = output<void>();

    states = signal<IAddressStateModel[]>([]);

    constructor() {
        super();
        this.createForm(this.createModel(), (schemaPath: any) => {
            required(schemaPath.zipCode, { message: 'CEP é obrigatório' });
            pattern(schemaPath.zipCode, PATTERNS.CEP, { message: 'CEP inválido. Formato esperado: 00000-000' });
            required(schemaPath.street, { message: 'Logradouro é obrigatório' });
            required(schemaPath.neighborhood, { message: 'Bairro é obrigatório' });
            required(schemaPath.city, { message: 'Cidade é obrigatória' });
            required(schemaPath.state, { message: 'Estado é obrigatório' });
        });
    }

    ngOnInit(): void {
        this.addressService.getStates().subscribe((result) => {
            this.states.set(result);
        });
    }

    override onSaveAction(): void {
        this.onSave.emit(this.model());
    }

    override onCancelAction(): void {
        this.onCancel.emit();
    }

    private createModel(): IAddressModel {
        return {
            id: null,
            person: null!,
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

    get typeLabel() {
        return 'Tipo de Endereço';
    }

    typeContentValueLabel(type: AddressType) {
        return ADDRESS_TYPE_LABEL[type];
    }
    typeValueLabel(type: AddressType) {
        return type;
    }

    get zipCodeLabel() {
        return 'Cep';
    }

    get streetLabel() {
        return 'Logradouro';
    }

    get numberLabel() {
        return 'Número';
    }

    get neighborhoodLabel() {
        return 'Bairro';
    }

    get cityLabel() {
        return 'Cidade';
    }

    get stateLabel() {
        return 'Cidade';
    }
}
