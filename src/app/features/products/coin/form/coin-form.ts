import { Component, inject } from '@angular/core';
import { BaseForm } from '@shared/classes/base-form';
import { ICoinModel } from '../interfaces/coin-model';
import { CoinService } from '../services/coin-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '@shared/components/toast/services/toast-service';
import { ICategoryModel } from '../../category/interfaces/category-model';
import { toSignal } from '@angular/core/rxjs-interop';
import { Field, maxLength, minLength, required, submit } from '@angular/forms/signals';
import { ISateSaveControl } from '@shared/interfaces/save-control';

@Component({
  selector: 'app-coin-form',
  imports: [Field],
  templateUrl: './coin-form.html',
  styleUrl: './coin-form.scss',
})
export class CoinForm extends BaseForm<ICoinModel, CoinService> {

  override service = inject(CoinService);

  private router = inject(Router);

  private route = inject(ActivatedRoute);

  private toastService = inject(ToastService);

  constructor() {
    super();
    this.createForm(this.createModel(), (schemaPath) => {
      required(schemaPath.name, { message: 'Nome da Moeda é obrigatório' }),
        minLength(schemaPath.name, 3, { message: 'Nome da Moeda deve ter 3 caracteres' }),
        required(schemaPath.symbol, { message: 'Símbolo é obrigatório' }),
        maxLength(schemaPath.symbol, 3, { message: 'Símbolo deve ter até 3 caracteres ' })
        ;
    });
  }

  private createModel(): ICoinModel {
    const routeData = toSignal(this.route.data);
    const dataModel = routeData()?.['data'];

    if (dataModel) {
      return dataModel as ICoinModel;
    } else {
      return {
        id: null,
        name: '',
        symbol: ''
      };
    }
  }

  override onSaveAction() {
    submit(this.formData, async () => {
      const category = this.model();

      this.updateSaveControl(
        ISateSaveControl.SAVING,
        category.id == null ? 'Salvando moeda' : 'Atualizando moeda'
      );

      this.toastService.show(this.saveControl().message, 'info');

      this.service.save(category).subscribe({
        next: () => {
          this.toastService.show('Registro salvo com sucesso', 'success', 1000);
          this.updateSaveControl(ISateSaveControl.OPEN, '');
          this.onCancelAction();
        },
        error: (_errorData) => {
          this.toastService.show('Falha ao salvar o registro', 'danger')
        }
      });
    });
  }

  override onCancelAction(): void {
    this.router.navigate(['coin', 'list']);
  }

  get formName() {
    return this.formData.name;
  }

  get formSymbol() {
    return this.formData.symbol;
  }
}
