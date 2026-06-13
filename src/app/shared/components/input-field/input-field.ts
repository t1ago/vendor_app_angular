import { Component, input, output } from '@angular/core';
import { Field, FormField } from '@angular/forms/signals';
import { IInputFieldOption } from './interfaces/input-field-option';

type InputFieldType = 'text' | 'date' | 'number' | 'select' | 'radio' | 'checkbox';

@Component({
    selector: 'app-input-field',
    imports: [FormField],
    templateUrl: './input-field.html',
    styleUrl: './input-field.scss',
})
export class InputField {
    field = input<Field<string>>();

    fieldBool = input<Field<boolean>>();

    label = input<string>();

    inputId = input<string>();

    type = input<InputFieldType>('text');

    options = input<IInputFieldOption[]>([]);

    onBlur = output<void>();

    onChange = output<void>();

    get activeField(): Field<any> {
        if (this.type() === 'checkbox') {
            return this.fieldBool()!;
        } else {
            return this.field()!;
        }
    }

    get activeFieldIsInvalid(): Boolean {
        return this.activeField().touched() && this.activeField().invalid();
    }

    get activeFieldErrors() {
        return this.activeField().errors();
    }

    get showLabel(): boolean {
        return !(['radio', 'checkbox'] as InputFieldType[]).includes(this.type());
    }
}
