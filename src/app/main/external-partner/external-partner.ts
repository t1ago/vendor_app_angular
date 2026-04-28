import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAuthTokenModel } from '@shared/interfaces/auth-token-model';
import { AuthStoreService } from '@shared/services/auth-store-service';
import { AuthUserService } from '@shared/services/auth-user-service';

@Component({
    selector: 'app-external-partner',
    imports: [],
    templateUrl: './external-partner.html',
    styleUrl: './external-partner.scss',
})
export class ExternalPartner {
    private router = inject(Router);

    private route = inject(ActivatedRoute);

    private authStoreService = inject(AuthStoreService);

    private authUserService = inject(AuthUserService);

    constructor() {
        this.processExternalRedirect();
    }

    private processExternalRedirect() {
        this.route.queryParamMap.subscribe((params) => {
            const redirectUrl = params.get('redirect');

            const secret = params.get('secret');

            const exp = params.get('exp');

            if (redirectUrl == null || secret == null || exp == null) {
                this.router.navigate(['unauthorized']);
            } else {
                const authTokenModel: IAuthTokenModel = {
                    token: secret,
                    expiresIn: Number(exp),
                };

                this.authStoreService.setAuthToken(authTokenModel);

                this.authUserService.user().subscribe((_) => {
                    this.router.navigateByUrl(redirectUrl);
                });
            }
        });
    }
}
