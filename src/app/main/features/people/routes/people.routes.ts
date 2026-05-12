import { Routes } from '@angular/router';

export const peopleRoutes: Routes = [
    {
        path: 'form/:type',
        loadComponent: () => import('../form/people-form').then((m) => m.PeopleForm),
    },
    {
        path: 'form/:type/:id',
        loadComponent: () => import('../form/people-form').then((m) => m.PeopleForm),
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
