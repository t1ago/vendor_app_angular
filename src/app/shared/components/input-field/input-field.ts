import { Component, input, output } from '@angular/core';
import { Field, FormField } from '@angular/forms/signals';
import { IInputFieldOption } from './interfaces/input-field-option';

type InputFieldType = 'text' | 'date' | 'number' | 'select' | 'radio';

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

    options = input<IInputFieldOption[]>([]);

    onBlur = output<void>();

    onChange = output<void>();
}
