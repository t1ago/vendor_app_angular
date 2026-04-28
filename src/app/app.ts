import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStoreService } from '@shared/services/auth-store-service';
import { Toast } from './shared/components/toast/toast';

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
