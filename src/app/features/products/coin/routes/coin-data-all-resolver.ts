import { ResolveFn } from "@angular/router";
import { CoinService } from "../services/coin-service";
import { inject } from "@angular/core";

export const coinDataAllResolver: ResolveFn<any> = (route, _state) => {
    const service = inject(CoinService);

    return service.getAll();
};