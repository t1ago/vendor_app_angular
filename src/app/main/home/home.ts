import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IAuthUserModel } from '@shared/interfaces/auth-user-model';
import { AuthStoreService } from '@shared/services/auth-store-service';

@Component({
    selector: 'app-home',
    imports: [RouterLink],
    templateUrl: './home.html',
    styleUrl: './home.scss',
})
export class Home {
    authStore = inject(AuthStoreService);

    get user(): IAuthUserModel {
        return this.authStore.user();
    }
}
