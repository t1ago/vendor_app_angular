import { Injectable, signal } from '@angular/core';
import { IPageLoadingService } from '../interfaces/page-loading-service';

@Injectable({
  providedIn: 'root',
})
export class PageLoadingService implements IPageLoadingService {
  private _isLoading = signal<Boolean>(false);

  isLoading = this._isLoading.asReadonly();

  show() {
    this._isLoading.set(true);
  }

  hide() {
    this._isLoading.set(false);
  }

}
