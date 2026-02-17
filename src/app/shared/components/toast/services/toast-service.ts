import { Injectable, signal } from '@angular/core';
import { ToastType } from '../types/toast-types';

@Injectable({ providedIn: 'root' })
export class ToastService {

  message = signal<string | null>(null);

  type = signal<ToastType>('info');

  title = signal<string>('Sistema');

  show(message: string, type: ToastType = 'info', timeoutClear: number = 3000) {
    this.message.set(message);

    this.type.set(type);

    const titles = { success: 'Sucesso', danger: 'Erro', info: 'Informação' };

    this.title.set(titles[type]);

    setTimeout(() => this.clear(), timeoutClear);
  }

  clear() {
    this.message.set(null);
  }
}
