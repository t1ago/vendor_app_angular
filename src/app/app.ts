import { Component, computed, inject, Signal, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { INavbarItem } from './shared/components/navbar/interfaces/navbar-item';
import { Toast } from './shared/components/toast/toast';
import { PageLoading } from './shared/components/page-loading/page-loading';
import { PageLoadingService } from './shared/components/page-loading/services/page-loading-service';
import { AuthStoreService } from '@shared/services/auth-store-service';

@Component({
    selector: 'app-root',
    imports: [Toast, RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    private authStore = inject(AuthStoreService);

    constructor() {
        this.authStore.loadFromStorage();
    }
}
