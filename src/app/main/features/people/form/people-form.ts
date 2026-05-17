import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FieldTree, FormField } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { BaseForm } from '@shared/classes/base-form';
import { map } from 'rxjs';
import { ILegalEntities } from '../interfaces/legal-entities.model';
import { INaturalPerson } from '../interfaces/natural-person.model';

export type PeopleFormModel = INaturalPerson | ILegalEntities;

@Component({
    selector: 'app-people-form',
    imports: [FormField],
    templateUrl: './people-form.html',
    styleUrl: './people-form.scss',
})
export class PeopleForm extends BaseForm<PeopleFormModel, null> {
    private route = inject(ActivatedRoute);

    private personType = toSignal(this.route.paramMap.pipe(map((params) => params.get('type'))));

    constructor() {
        super();
        this.createForm(this.createModel(), (schemaPath: any) => {
            // (required(schemaPath.name, { message: 'Nome é obrigatório' }),
            //     minLength(schemaPath.name, 3, { message: 'Nome deve ter 3 caracteres' }));
        });
    }

    private createModel(): PeopleFormModel {
        if (this.isNaturalPerson()) {
            return this.makeNaturalPerson();
        } else {
            return this.makeLegalEntities();
        }

        // const routeData = toSignal(this.route.data);
        // const dataModel = routeData()?.['data'];

        // if (dataModel) {
        //    return dataModel as ICategoryModel;
        //} else {
        // }
    }

    isNaturalPerson(): boolean {
        return this.personType() !== 'J';
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
        } satisfies INaturalPerson;
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
        } satisfies ILegalEntities;
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

    private get naturalPersonTree() {
        return (this.formData as FieldTree<ILegalEntities>).naturalPerson;
    }

    get formNaturalPersonId() {
        return this.naturalPersonTree.id;
    }

    get selectedNaturalPerson() {
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

    get personBirthDateLabel(): string {
        return 'Data de Nascimento';
    }

    get personNaturalPersonIdLabel(): string {
        return 'Sócio';
    }
}
