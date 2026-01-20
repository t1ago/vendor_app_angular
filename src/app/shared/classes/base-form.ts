import { inject, signal, WritableSignal } from '@angular/core';
import { ISateSaveControl, ISaveControl } from '../interfaces/save-control';
import { FieldTree, form, FormOptions, SchemaOrSchemaFn } from '@angular/forms/signals';

export class BaseForm<MODEL, SERVICE> {
  saveControl = signal({} as ISaveControl);

  model!: WritableSignal<MODEL>;

  formData!: FieldTree<MODEL>;

  service!: SERVICE;

  createForm(model: MODEL, schemaPath: SchemaOrSchemaFn<MODEL> | FormOptions) {
    this.model = signal(model);
    this.formData = form(this.model, schemaPath);
  }

  onSaveAction(): void {
    throw new Error('Method not implemented.');
  }

  onCancelAction(): void {
    throw new Error('Method not implemented.');
  }

  updateSaveControl(state: ISateSaveControl, message: string) {
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
    return this.saveControl().state == ISateSaveControl.SAVING;
  }

  get messageSaveAction(): string {
    return this.saveControl().message;
  }
}
