import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CoinService } from '../services/coin-service';

export const coinDataAllResolver: ResolveFn<any> = (route, _state) => {
    const service = inject(CoinService);

    return service.getAll();
};
