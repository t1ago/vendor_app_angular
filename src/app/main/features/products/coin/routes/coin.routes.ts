import { Routes } from '@angular/router';
import { coinDataAllResolver } from './coin-data-all-resolver';
import { coinDataIdResolver } from './coin-data-id-resolver';

export const coinRoutes: Routes = [
    {
        path: 'form',
        loadComponent: () => import('../form/coin-form').then((m) => m.CoinForm),
    },
    {
        path: 'form/:id',
        loadComponent: () => import('../form/coin-form').then((m) => m.CoinForm),
        resolve: {
            data: coinDataIdResolver,
        },
    },
    {
        path: 'list',
        loadComponent: () => import('../list/coin-list').then((m) => m.CoinList),
        resolve: {
            data: coinDataAllResolver,
        },
    },
];
