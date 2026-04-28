import { Routes } from '@angular/router';
import { Unauthorized } from '@shared/components/unauthorized/unauthorized';
import { authGuard } from '@shared/guards/auth-guard';
import { Login } from './login/login';
import { ExternalPartner } from './main/external-partner/external-partner';
import { Home } from './main/home/home';
import { Main } from './main/main';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
    },
    {
        path: 'unauthorized',
        component: Unauthorized,
    },
    {
        path: '',
        component: Main,
        canActivate: [authGuard],
        children: [
            {
                path: 'home',
                component: Home,
            },
            {
                path: 'category',
                loadChildren: () =>
                    import('./main/features/products/category/routes/category.routes').then((m) => m.categoryRoutes),
            },
            {
                path: 'coin',
                loadChildren: () =>
                    import('./main/features/products/coin/routes/coin.routes').then((m) => m.coinRoutes),
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full',
            },
        ],
    },
    {
        path: 'externalPartner',
        component: ExternalPartner,
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];
