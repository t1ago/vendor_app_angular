import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PersonService } from '../services/person-service';

export const personDataAllResolver: ResolveFn<any> = (route, _state) => {
    const personType = route.routeConfig?.path?.includes('naturalPerson') ? 'F' : 'J';

    const service = inject(PersonService);

    return service.getAllByType(personType);
};
