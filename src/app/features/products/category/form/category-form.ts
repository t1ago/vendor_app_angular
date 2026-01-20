import { Component, inject, signal } from '@angular/core';
import { ICategoryModel } from '../interfaces/category-model';
import { Field, form, minLength, required, submit } from '@angular/forms/signals';
import { CategoryService } from '../services/category-service';
import { ISateSaveControl, ISaveControl } from '../../../../shared/interfaces/save-control';
import { BaseForm } from '../../../../shared/classes/base-form';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-category-form',
  imports: [Field],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryForm extends BaseForm<ICategoryModel, CategoryService> {
  override service = inject(CategoryService);
  private router = inject(Router);

  private route = inject(ActivatedRoute);

  constructor() {
    super();
    this.createForm(this.createModel(), (schemaPath) => {
      required(schemaPath.name, { message: 'Nome é obrigatório' }),
        minLength(schemaPath.name, 3, { message: 'Nome deve ter 3 caracteres' });
    });
  }

  private createModel(): ICategoryModel {
    const routeData = toSignal(this.route.data);
    const dataModel = routeData()?.['data'];

    if (dataModel) {
      return dataModel as ICategoryModel;
    } else {
      return {
        id: null,
        name: '',
      };
    }
  }

  override onSaveAction() {
    submit(this.formData, async () => {
      const category = this.model();

      this.updateSaveControl(
        ISateSaveControl.SAVING,
        category.id == null ? 'Salvando categoria' : 'Atualizando categoria'
      );

      this.service.save(category).subscribe(() => {
        this.updateSaveControl(ISateSaveControl.OPEN, '');
        this.onCancelAction();
      });
    });
  }

  override onCancelAction(): void {
    this.router.navigate(['category', 'list']);
  }

  get formName() {
    return this.formData.name;
  }
}
