import { ResolveFn, Router } from "@angular/router";
import { CoinService } from "../services/coin-service";
import { inject } from "@angular/core";
import { EMPTY } from "rxjs";

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