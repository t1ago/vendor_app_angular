import { Component, input, output } from '@angular/core';
import { Field, FormField } from '@angular/forms/signals';
import { IFormFieldOption } from './interfaces/input-field-option';

type InputFieldType = 'text' | 'date' | 'number' | 'select';

@Component({
    selector: 'app-input-field',
    imports: [FormField],
    templateUrl: './input-field.html',
    styleUrl: './input-field.scss',
})
export class InputField {
    field = input.required<Field<string>>();

    label = input.required<string>();

    inputId = input.required<string>();

    type = input<InputFieldType>('text');

    options = input<IFormFieldOption[]>([]);

    onBlur = output<void>();

    onChange = output<void>();
}
