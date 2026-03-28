import { Routes } from '@angular/router';
import { Home } from './main/home/home';
import { Unauthorized } from '@shared/components/unauthorized/unauthorized';
import { Login } from './login/login';
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
        // canActivate: [AuthGuard], // Dica: Adicione seu Guard aqui no futuro para proteger tudo
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
        path: '**',
        redirectTo: 'login',
    },
];
