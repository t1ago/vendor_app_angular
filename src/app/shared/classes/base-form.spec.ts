import { BaseForm } from './base-form';
import { describe, it, expect } from 'vitest';
import {
  Component,
  EnvironmentInjector,
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ISateSaveControl } from '../interfaces/save-control';
import { required } from '@angular/forms/signals';

describe('BaseForm', () => {
  let form: TestForm;
  let injector: EnvironmentInjector;

  beforeEach(() => {
    const parentInjector = Injector.create({
      providers: [],
    });

    injector = TestBed.inject(EnvironmentInjector);

    runInInjectionContext(injector, () => {
      form = new TestForm();
    });
  });

  it('should create an instance', () => {
    // THEN
    expect(form).toBeTruthy();
  });

  it('should initialize model and formData', () => {
    // GIVEN
    const model: ITestForm = {
      name: 'Test',
    };

    const schema = {};

    // WHEN
    runInInjectionContext(injector, () => {
      form.createForm(model, schema);
    });

    // THEN
    expect(form.model).toBeDefined();
    expect(form.model()).toEqual(model);

    expect(form.formData).toBeDefined();
    expect(typeof form.formData).toBe('function');
  });

  it('should verify service', () => {
    // GIVEN
    runInInjectionContext(injector, () => {
      form.onSaveAction();
    });

    // THEN
    expect(form.service.target()).toBeTruthy();
  });

  it('should updateSaveControl', () => {
    // GIVEN
    runInInjectionContext(injector, () => {
      form.updateSaveControl(ISateSaveControl.SAVING, 'test');
    });

    // THEN
    expect(form.messageSaveAction).toBe('test');
    expect(form.isSaveAction).toBeTruthy();
  });

  it('should verify form valid', () => {
    // GIVEN
    const model: ITestForm = {
      name: '',
    };

    const schema = (schemaPath: any) => {
      required(schemaPath.name, { message: 'Nome é obrigatório' });
    };

    // WHEN
    runInInjectionContext(injector, () => {
      form.createForm(model, schema);
    });

    // THEN
    expect(form.isDisabledSaveAction).toBeTruthy();

    // WHEN
    runInInjectionContext(injector, () => {
      form.formData.name().value.set('test');
    });

    // THEN
    expect(form.isDisabledSaveAction).toBeFalsy();
  });

  it('should verify erros', () => {
    // GIVEN
    runInInjectionContext(injector, () => {
      form = new TestFormWithoutActions();
    });

    // THEN
    runInInjectionContext(injector, () => {
      expect(() => form.onSaveAction()).toThrowError('Method not implemented.');
      expect(() => form.onCancelAction()).toThrowError('Method not implemented.');
    });
  });
});

@Component({
  standalone: true,
  template: '',
})
class TestForm extends BaseForm<ITestForm, TestService> {
  override service = inject(TestService);

  override onSaveAction(): void {
    this.service.inTarget();
  }
  override onCancelAction(): void {
    this.service.outTarget();
  }
}

@Component({
  standalone: true,
  template: '',
})
class TestFormWithoutActions extends BaseForm<ITestForm, TestService> {
  override service = inject(TestService);
}

@Injectable({
  providedIn: 'root',
})
class TestService {
  target = signal(false);

  inTarget() {
    this.target.set(true);
  }

  outTarget() {
    this.target.set(false);
  }
}

interface ITestForm {
  name: string;
}
