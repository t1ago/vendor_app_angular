import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormField } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { BaseForm } from '@shared/classes/base-form';
import { map } from 'rxjs';
import { IPeopleModel } from '../interfaces/people.model';

@Component({
    selector: 'app-people-form',
    imports: [FormField],
    templateUrl: './people-form.html',
    styleUrl: './people-form.scss',
})
export class PeopleForm extends BaseForm<IPeopleModel, null> {
    private route = inject(ActivatedRoute);

    constructor() {
        super();
        this.createForm(this.createModel(), (schemaPath: any) => {
            // (required(schemaPath.name, { message: 'Nome é obrigatório' }),
            //     minLength(schemaPath.name, 3, { message: 'Nome deve ter 3 caracteres' }));
        });
    }

    private createModel(): IPeopleModel {
        const personType = toSignal(this.route.paramMap.pipe(map((params) => params.get('type'))));

        // const routeData = toSignal(this.route.data);
        // const dataModel = routeData()?.['data'];

        // if (dataModel) {
        //    return dataModel as ICategoryModel;
        //} else {
        return {
            id: null,
            name: '',
            surname: '',
            type: personType() == 'J' ? 'J' : 'F',
            federalDocument: { number: '' },
            stateDocument: { number: '' },
            active: true,
        };
        // }
    }

    private isNaturalPerson(): boolean {
        return this.model().type == 'F';
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
}
