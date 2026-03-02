import { Component, inject, input, Signal, signal } from '@angular/core';
import { PageLoadingService } from './services/page-loading-service';

@Component({
  selector: 'app-page-loading',
  imports: [],
  templateUrl: './page-loading.html',
  styleUrl: './page-loading.scss',
})
export class PageLoading {
  isLoading = input<Boolean>(false);
}
