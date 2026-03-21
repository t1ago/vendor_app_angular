import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class EnvironmentService {
    get vendorServiceHost(): string {
        return environment.vendor_service_host;
    }
}
