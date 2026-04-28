import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { CoinService } from '../services/coin-service';

export const coinDataIdResolver: ResolveFn<any> = (route, _state) => {
    const service = inject(CoinService);
    const router = inject(Router);

    const id = route.paramMap.get('id');

    if (id) {
        return service.getById(id);
    } else {
        router.navigateByUrl('/coin/form');
        return EMPTY;
    }
};
