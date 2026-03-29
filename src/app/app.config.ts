import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { HttpAuthInterceptor } from '@shared/interceptors/http-auth-interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withFetch(), withInterceptors([HttpAuthInterceptor])),
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
    ],
};
