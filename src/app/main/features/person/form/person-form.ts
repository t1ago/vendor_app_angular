import { Component, inject, signal } from '@angular/core';
import { FieldTree, FormField, minLength, pattern, required } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { BaseForm } from '@shared/classes/base-form';
import { IAddressModel } from '../interfaces/address.model';
import { ILegalEntities } from '../interfaces/legal-entities.model';
import { INaturalPerson } from '../interfaces/natural-person.model';
import { AddressForm } from './address/form/address-form';
import { AddressList } from './address/list/address-list';

export type PersonFormModel = INaturalPerson | ILegalEntities;
export type AddressMode = 'list' | 'form';

const PATTERNS = {
    CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    RG: /^\d{1,2}\.\d{3}\.\d{3}-[\dxX]$/,
    IE: /^\d{3}\.?\d{3}\.?\d{3}\.?\d{3}$/,
};

@Component({
    selector: 'app-person-form',
    imports: [FormField, AddressList, AddressForm],
    templateUrl: './person-form.html',
    styleUrl: './person-form.scss',
})
export class PersonForm extends BaseForm<PersonFormModel, null> {
    private route = inject(ActivatedRoute);

    naturalPersonSearchById = signal<number | null>(null);

    addressMode = signal<AddressMode>('list');

    constructor() {
        super();

        this.createForm(this.createModel(), (schemaPath: any) => {
            if (this.isNaturalPerson()) {
                this.applyNaturalPersonValidations(schemaPath);
            } else {
                this.applyLegalEntityValidations(schemaPath);
            }
        });
    }

    isNaturalPerson(): boolean {
        const personType = this.route.snapshot.routeConfig?.path?.includes('naturalPerson') ? 'F' : 'J';
        return personType !== 'J';
    }

    onAddressNew(): void {
        this.addressMode.set('form');
    }

    onAddressFormCancel(): void {
        this.addressMode.set('list');
    }

    onAddressFormSave(address: IAddressModel): void {
        this.model.update((model) => ({
            ...model,
            addresses: [...(model.addresses ?? []), address],
        }));
        this.addressMode.set('list');
    }

    isAddressModeList(): boolean {
        return this.addressMode() === 'list';
    }

    private createModel(): PersonFormModel {
        if (this.isNaturalPerson()) {
            return this.makeNaturalPerson();
        }
        return this.makeLegalEntities();
    }

    private makeNaturalPerson(): INaturalPerson {
        return {
            id: null,
            name: '',
            surname: '',
            type: 'F',
            federalDocument: { number: '' },
            stateDocument: { number: '' },
            active: true,
            sex: 'M',
            birthDate: '',
            addresses: [],
        } satisfies INaturalPerson;
    }

    private applyNaturalPersonValidations(schemaPath: any): void {
        required(schemaPath.name, { message: 'Nome é obrigatório' });
        minLength(schemaPath.name, 3, { message: 'Nome deve ter no mínimo 3 caracteres' });
        required(schemaPath.surname, { message: 'Apelido é obrigatório' });
        minLength(schemaPath.surname, 3, { message: 'Apelido deve ter no mínimo 3 caracteres' });
        required(schemaPath.stateDocument.number, { message: 'RG é obrigatório' });
        pattern(schemaPath.stateDocument.number, PATTERNS.RG, {
            message: 'RG inválido. Formato esperado: 00.000.000-0',
        });
        required(schemaPath.federalDocument.number, { message: 'CPF é obrigatório' });
        pattern(schemaPath.federalDocument.number, PATTERNS.CPF, {
            message: 'CPF inválido. Formato esperado: 000.000.000-00',
        });
    }

    private makeLegalEntities(): ILegalEntities {
        return {
            id: null,
            name: '',
            surname: '',
            type: 'J',
            federalDocument: { number: '' },
            stateDocument: { number: '' },
            active: true,
            naturalPerson: this.makeNaturalPerson(),
            addresses: [],
        } satisfies ILegalEntities;
    }

    private applyLegalEntityValidations(schemaPath: any): void {
        required(schemaPath.name, { message: 'Razão Social é obrigatória' });
        minLength(schemaPath.name, 3, { message: 'Razão Social deve ter no mínimo 3 caracteres' });
        required(schemaPath.surname, { message: 'Nome Fantasia é obrigatório' });
        minLength(schemaPath.surname, 3, { message: 'Nome Fantasia deve ter no mínimo 3 caracteres' });
        required(schemaPath.stateDocument.number, { message: 'Inscrição Estadual é obrigatória' });
        pattern(schemaPath.stateDocument.number, PATTERNS.IE, { message: 'Inscrição Estadual inválida' });
        required(schemaPath.federalDocument.number, { message: 'CNPJ é obrigatório' });
        pattern(schemaPath.federalDocument.number, PATTERNS.CNPJ, {
            message: 'CNPJ inválido. Formato esperado: 00.000.000/0000-00',
        });
    }

    get addresses(): IAddressModel[] {
        return this.model().addresses ?? [];
    }

    get formName() {
        return this.formData.name;
    }

    get formSurname() {
        return this.formData.surname;
    }

    get formType() {
        return this.formData.type;
    }

    get formStateDocument() {
        return this.formData.stateDocument.number;
    }

    get formFederalDocument() {
        return this.formData.federalDocument.number;
    }

    get formSex() {
        return (this.formData as FieldTree<INaturalPerson>).sex;
    }

    get formBirthDate() {
        return (this.formData as FieldTree<INaturalPerson>).birthDate;
    }

    get selectedNaturalPerson(): INaturalPerson {
        return (this.model() as ILegalEntities).naturalPerson;
    }

    get personTypeLabel(): string {
        return this.isNaturalPerson() ? 'Pessoa Física' : 'Pessoa Jurídica';
    }

    get personNameLabel(): string {
        return this.isNaturalPerson() ? 'Nome' : 'Razão Social';
    }

    get personSurnameLabel(): string {
        return this.isNaturalPerson() ? 'Apelido' : 'Nome Fantasia';
    }

    get personStateDocumentLabel(): string {
        return this.isNaturalPerson() ? 'RG' : 'Insc. Estadual';
    }

    get personFederalDocumentLabel(): string {
        return this.isNaturalPerson() ? 'CPF' : 'CNPJ';
    }

    get personSexLabel(): string {
        return 'Sexo';
    }

    get personSexMaleLabel(): string {
        return 'Masculino';
    }

    get personSexFemaleLabel(): string {
        return 'Feminino';
    }

    get personBirthDateLabel(): string {
        return 'Data de Nascimento';
    }

    get personNaturalPersonIdLabel(): string {
        return 'Sócio';
    }
}
