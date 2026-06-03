import { Routes } from '@angular/router';

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
        path: 'form/:type',
        loadComponent: () => import('../form/person-form').then((m) => m.PersonForm),
        // resolve: {
        //     data: categoryDataIdResolver,
        // },
    },
    // {
    //     path: 'list',
    //     loadComponent: () => import('../list/category-list').then((m) => m.CategoryList),
    //     resolve: {
    //         data: categoryDataAllResolver,
    //     },
    // },
];
