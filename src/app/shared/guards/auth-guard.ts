import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStoreService } from '@shared/services/auth-store-service';

export const authGuard: CanActivateFn = () => {
    const authStore = inject(AuthStoreService);
    const router = inject(Router);

    if (authStore.isLogged()) {
        return true;
    }

    router.navigate(['/unauthorized']);
    return false;
};
