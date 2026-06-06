import { Routes } from '@angular/router';
import { personDataAllResolver } from './person-data-all-resolver';
import { personDataIdResolver } from './person-data-id-resolver';

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
        path: 'form/legalEntities/:id',
        loadComponent: () => import('../form/person-form').then((m) => m.PersonForm),
        resolve: {
            data: personDataIdResolver,
        },
    },
    {
        path: 'form/naturalPerson/:id',
        loadComponent: () => import('../form/person-form').then((m) => m.PersonForm),
        resolve: {
            data: personDataIdResolver,
        },
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
