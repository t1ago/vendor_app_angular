import { Routes } from '@angular/router';
import { measureDataAllResolver } from './measure-data-all-resolver';
import { measureDataIdResolver } from './measure-data-id-resolver';

export const measureRoutes: Routes = [
    {
        path: 'form',
        loadComponent: () => import('../form/measure-form').then((m) => m.MeasureForm),
    },
    {
        path: 'form/:id',
        loadComponent: () => import('../form/measure-form').then((m) => m.MeasureForm),
        resolve: {
            data: measureDataIdResolver,
        },
    },
    {
        path: 'list',
        loadComponent: () => import('../list/measure-list').then((m) => m.MeasureList),
        resolve: {
            data: measureDataAllResolver,
        },
    },
];
