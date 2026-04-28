import { signal, WritableSignal } from '@angular/core';
import { FieldTree, form, SchemaOrSchemaFn } from '@angular/forms/signals';
import { ISateSaveControlModel, ISaveControlModel } from '../interfaces/save-control-model';

export class BaseForm<MODEL, SERVICE> {
    saveControl = signal({} as ISaveControlModel);

    model!: WritableSignal<MODEL>;

    formData!: FieldTree<MODEL>;

    service!: SERVICE;

    createForm(model: MODEL, schemaPath: SchemaOrSchemaFn<MODEL>) {
        this.model = signal(model);
        this.formData = form(this.model, schemaPath);
    }

    onSaveAction(): void {
        throw new Error('Method not implemented.');
    }

    onCancelAction(): void {
        throw new Error('Method not implemented.');
    }

    updateSaveControl(state: ISateSaveControlModel, message: string) {
        this.saveControl.update(() => {
            return {
                state: state,
                message: message,
            };
        });
    }

    get isDisabledSaveAction(): boolean {
        return this.formData().invalid();
    }

    get isSaveAction(): boolean {
        return this.saveControl().state == ISateSaveControlModel.SAVING;
    }

    get messageSaveAction(): string {
        return this.saveControl().message;
    }
}
