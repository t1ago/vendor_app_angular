import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStoreService } from '@shared/services/auth-store-service';

export const HttpAuthInterceptor: HttpInterceptorFn = (req, next) => {
    const authStore = inject(AuthStoreService);

    const token = authStore.getToken();

    if (!token || req.url.includes('/login')) {
        return next(req);
    } else {
        const clonedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });

        return next(clonedRequest);
    }
};
