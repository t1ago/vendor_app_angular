import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { PersonService } from '../services/person-service';
import { makePath } from './person-path';

export const personDataIdResolver: ResolveFn<any> = (route, _state) => {
    const personType = route.routeConfig?.path?.includes('naturalPerson') ? 'F' : 'J';

    const service = inject(PersonService);

    const router = inject(Router);

    const id = route.paramMap.get('id');

    if (id) {
        return service.getById(id);
    } else {
        const path = makePath(personType == 'F', 'form', id);

        router.navigate(path);

        return EMPTY;
    }
};
