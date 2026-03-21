import { Routes } from '@angular/router';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { Home } from './home/home';
import { Unauthorized } from '@shared/components/unauthorized/unauthorized';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: Home,
    },
    {
        path: 'unauthorized',
        component: Unauthorized,
    },
    {
        path: 'category',
        loadChildren: () => import('@features/products/category/routes/category.routes').then((m) => m.categoryRoutes),
    },
    {
        path: 'coin',
        loadChildren: () => import('@features/products/coin/routes/coin.routes').then((m) => m.coinRoutes),
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];
