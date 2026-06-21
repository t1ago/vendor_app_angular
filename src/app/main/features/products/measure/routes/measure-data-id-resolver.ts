import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { MeasureService } from '../services/measure-service';

export const measureDataIdResolver: ResolveFn<any> = (route, _state) => {
    const service = inject(MeasureService);
    const router = inject(Router);
    const id = route.paramMap.get('id');

    if (id) {
        return service.getById(id);
    } else {
        router.navigateByUrl('/measure/form');
        return EMPTY;
    }
};
