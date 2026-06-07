import { HttpStatusCode } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FieldTree, FormField, minLength, pattern, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseForm } from '@shared/classes/base-form';
import { ToastService } from '@shared/components/toast/services/toast-service';
import { ISateSaveControlModel } from '@shared/interfaces/save-control-model';
import { IAddressEvent } from '../interfaces/address-event';
import { IAddressModel } from '../interfaces/address.model';
import { ILegalEntities } from '../interfaces/legal-entities.model';
import { INaturalPerson } from '../interfaces/natural-person.model';
import { makePath } from '../routes/person-path';
import { PersonService } from '../services/person-service';
import { PersonModelType } from '../types/person-model.type';
import { AddressForm } from './address/form/address-form';
import { AddressList } from './address/list/address-list';
import { NaturalPersonSearch } from './natural-person-search/natural-person-search';

export type AddressMode = 'list' | 'form';

const PATTERNS = {
    CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    RG: /^\d{1,2}\.\d{3}\.\d{3}-[\dxX]$/,
    IE: /^\d{3}\.?\d{3}\.?\d{3}\.?\d{3}$/,
};

@Component({
    selector: 'app-person-form',
    imports: [FormField, AddressList, AddressForm, NaturalPersonSearch],
    templateUrl: './person-form.html',
    styleUrl: './person-form.scss',
})
export class PersonForm extends BaseForm<PersonModelType, PersonService> implements OnInit {
    private route = inject(ActivatedRoute);

    private router = inject(Router);

    override service = inject(PersonService);

    private toastService = inject(ToastService);

    naturalPersonSearchById = signal<number | null>(null);

    addressMode = signal<AddressMode>('list');

    addressEvent: IAddressEvent | null = null;

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
    ngOnInit(): void {
        const routeData = this.route.snapshot.data['data'];
        if (routeData) {
            this.model.set(routeData);
        }
    }

    isNaturalPerson(): boolean {
        const personType = this.route.snapshot.routeConfig?.path?.includes('naturalPerson') ? 'F' : 'J';
        return personType !== 'J';
    }

    onAddressNew(): void {
        this.addressEvent = null;
        this.addressMode.set('form');
    }

    onAddressEdit(addressEvent: IAddressEvent) {
        this.addressEvent = addressEvent;
        this.addressMode.set('form');
    }

    onAddressUpdateActive(addressEvent: IAddressEvent): void {
        this.model.update((model) => {
            const addresses = [...(model.addresses ?? [])];

            if (addressEvent.index !== null && addressEvent.index! >= 0) {
                if (addressEvent.address.id === null) {
                    addresses.splice(addressEvent.index!, 1);
                } else {
                    addresses[addressEvent.index!] = {
                        ...addressEvent.address,
                        active: !addressEvent.address.active,
                    };
                }
            }

            return { ...model, addresses };
        });
    }

    onAddressFormCancel(): void {
        this.addressMode.set('list');
    }

    onAddressFormSave(addressEvent: IAddressEvent): void {
        this.model.update((model) => {
            const addresses = [...(model.addresses ?? [])];

            if (addressEvent.index !== null && addressEvent.index! >= 0) {
                addresses[addressEvent.index!] = addressEvent.address;
            } else {
                addresses.push(addressEvent.address);
            }

            return { ...model, addresses: addresses };
        });
        this.addressMode.set('list');
    }

    onNaturalPersonSelect(person: INaturalPerson | null): void {
        this.model.update(
            (m) =>
                ({
                    ...m,
                    naturalPerson: person,
                }) as ILegalEntities
        );
    }

    isAddressModeList(): boolean {
        return this.addressMode() === 'list';
    }

    override onSaveAction() {
        submit(this.formData, async () => {
            const person = this.model();

            this.updateSaveControl(
                ISateSaveControlModel.SAVING,
                person.id == null ? 'Salvando Pessoa' : 'Atualizando Pessoa'
            );

            this.toastService.show(this.saveControl().message, 'info');

            this.service.save(person).subscribe({
                next: () => {
                    this.toastService.show('Registro salvo com sucesso', 'success', 1000);
                    this.updateSaveControl(ISateSaveControlModel.OPEN, '');
                    this.onCancelAction();
                },
                error: (errorData) => {
                    if (errorData.status == HttpStatusCode.InternalServerError) {
                        this.toastService.show(errorData.error?.mensagem || 'Falha ao salvar o registro', 'danger');
                    } else {
                        this.toastService.show('Falha ao salvar o registro', 'danger');
                    }

                    this.updateSaveControl(ISateSaveControlModel.OPEN, '');
                },
            });
        });
    }

    override onCancelAction(): void {
        const path = makePath(this.isNaturalPerson(), 'list');
        this.router.navigate(path);
    }

    private createModel(): PersonModelType {
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
