import { Routes } from '@angular/router';
import { personDataAllResolver } from './person-data-all-resolver';

export const personRoutes: Routes = [
    {
        path: 'form/legalEntities',
        loadComponent: () => import('../form/person-form').then((m) => m.PersonForm),
    },
    {
        path: 'form/naturalPerson',
        loadComponent: () => import('../form/person-form').then((m) => m.PersonForm),
    },
    {
        path: 'list/legalEntities',
        loadComponent: () => import('../list/person-list').then((m) => m.PersonList),
        resolve: {
            data: personDataAllResolver,
        },
    },
    {
        path: 'list/naturalPerson',
        loadComponent: () => import('../list/person-list').then((m) => m.PersonList),
        resolve: {
            data: personDataAllResolver,
        },
    },
];
