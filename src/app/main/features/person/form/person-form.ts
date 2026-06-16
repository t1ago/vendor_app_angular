import { HttpStatusCode } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FieldTree, minLength, pattern, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BaseForm } from '@shared/classes/base-form';
import { InputField } from '@shared/components/input-field/input-field';
import { IInputFieldOption } from '@shared/components/input-field/interfaces/input-field-option';
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

// TODO: Verificar porque os ativos mesmo colocando como inativo ao salvar fica ativo o registro

export type AddressMode = 'list' | 'form';

const PATTERNS = {
    CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    CNPJ: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    RG: /^\d{1,2}\.\d{3}\.\d{3}-[\dxX]$/,
    IE: /^\d{3}\.?\d{3}\.?\d{3}\.?\d{3}$/,
};

@Component({
    selector: 'app-person-form',
    imports: [InputField, AddressList, AddressForm, NaturalPersonSearch, TranslatePipe],
    templateUrl: './person-form.html',
    styleUrl: './person-form.scss',
})
export class PersonForm extends BaseForm<PersonModelType, PersonService> implements OnInit {
    private route = inject(ActivatedRoute);

    private router = inject(Router);

    override service = inject(PersonService);

    private toastService = inject(ToastService);

    private translate = inject(TranslateService);

    naturalPersonSearchById = signal<number | null>(null);

    addressMode = signal<AddressMode>('list');

    addressEvent: IAddressEvent | null = null;

    personSexOptions = computed<IInputFieldOption[]>(() => [
        { value: 'M', label: this.translate.instant('MAIN.FEATURES.PERSON.PERSONSEXMALE') },
        { value: 'F', label: this.translate.instant('MAIN.FEATURES.PERSON.PERSONSEXFEMALE') },
    ]);

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
        console.log(routeData);
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
                person.id == null
                    ? this.translate.instant('COMMONS.SAVING')
                    : this.translate.instant('COMMONS.UPDATING')
            );

            this.toastService.show(this.saveControl().message, 'info');

            this.service.save(person).subscribe({
                next: () => {
                    this.toastService.show(this.translate.instant('COMMONS.RECORDSAVEDWITHSUCCESS'), 'success', 1000);
                    this.updateSaveControl(ISateSaveControlModel.OPEN, '');
                    this.onCancelAction();
                },
                error: (errorData) => {
                    if (errorData.status == HttpStatusCode.InternalServerError) {
                        this.toastService.show(
                            errorData.error?.mensagem || this.translate.instant('COMMONS.FAILSTOSAVERECORD'),
                            'danger'
                        );
                    } else {
                        this.toastService.show(this.translate.instant('COMMONS.FAILSTOSAVERECORD'), 'danger');
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
        required(schemaPath.name, { message: 'MAIN.FEATURES.PERSON.VALIDATION.NAMEREQUIRED' });
        minLength(schemaPath.name, 3, { message: 'MAIN.FEATURES.PERSON.VALIDATION.NAMEMINLENGTH' });
        required(schemaPath.surname, { message: 'MAIN.FEATURES.PERSON.VALIDATION.SURNAMEREQUIRED' });
        minLength(schemaPath.surname, 3, { message: 'MAIN.FEATURES.PERSON.VALIDATION.SURNAMEMINLENGTH' });
        required(schemaPath.stateDocument.number, { message: 'MAIN.FEATURES.PERSON.VALIDATION.RGREQUIRED' });
        pattern(schemaPath.stateDocument.number, PATTERNS.RG, {
            message: 'MAIN.FEATURES.PERSON.VALIDATION.RGINVALID',
        });
        required(schemaPath.federalDocument.number, { message: 'MAIN.FEATURES.PERSON.VALIDATION.CPFREQUIRED' });
        pattern(schemaPath.federalDocument.number, PATTERNS.CPF, {
            message: 'MAIN.FEATURES.PERSON.VALIDATION.CPFINVALID',
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
        required(schemaPath.name, { message: 'MAIN.FEATURES.PERSON.VALIDATION.COMPANYNAMEREQUIRED' });
        minLength(schemaPath.name, 3, { message: 'MAIN.FEATURES.PERSON.VALIDATION.COMPANYNAMEMINLENGTH' });
        required(schemaPath.surname, { message: 'MAIN.FEATURES.PERSON.VALIDATION.TRADENAMEREQUIRED' });
        minLength(schemaPath.surname, 3, { message: 'MAIN.FEATURES.PERSON.VALIDATION.TRADENAMEMINLENGTH' });
        required(schemaPath.stateDocument.number, {
            message: 'MAIN.FEATURES.PERSON.VALIDATION.STATEREGISTRATIONREQUIRED',
        });
        pattern(schemaPath.stateDocument.number, PATTERNS.IE, {
            message: 'MAIN.FEATURES.PERSON.VALIDATION.STATEREGISTRATIONINVALID',
        });
        required(schemaPath.federalDocument.number, { message: 'MAIN.FEATURES.PERSON.VALIDATION.CNPJREQUIRED' });
        pattern(schemaPath.federalDocument.number, PATTERNS.CNPJ, {
            message: 'MAIN.FEATURES.PERSON.VALIDATION.CNPJINVALID',
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

    get formActive() {
        return this.formData.active;
    }

    get personTypeLabel(): string {
        return this.isNaturalPerson()
            ? 'MAIN.FEATURES.PERSON.PERSONTYPENATURAL'
            : 'MAIN.FEATURES.PERSON.PERSONTYPELEGAL';
    }

    get personNameLabel(): string {
        return this.isNaturalPerson()
            ? 'MAIN.FEATURES.PERSON.PERSONNAMENATURAL'
            : 'MAIN.FEATURES.PERSON.PERSONNAMELEGAL';
    }

    get personSurnameLabel(): string {
        return this.isNaturalPerson()
            ? 'MAIN.FEATURES.PERSON.PERSONSURNAMENATURAL'
            : 'MAIN.FEATURES.PERSON.PERSONSURNAMELEGAL';
    }

    get personStateDocumentLabel(): string {
        return this.isNaturalPerson()
            ? 'MAIN.FEATURES.PERSON.PERSONSTATEDOCUMENTNATURAL'
            : 'MAIN.FEATURES.PERSON.PERSONSTATEDOCUMENTLEGAL';
    }

    get personFederalDocumentLabel(): string {
        return this.isNaturalPerson()
            ? 'MAIN.FEATURES.PERSON.PERSONFEDERALDOCUMENTNATURAL'
            : 'MAIN.FEATURES.PERSON.PERSONFEDERALDOCUMENTLEGAL';
    }

    get personActiveLabel(): string {
        return this.model().active ? 'MAIN.FEATURES.PERSON.PERSONACTIVE' : 'MAIN.FEATURES.PERSON.PERSONINACTIVE';
    }
}
