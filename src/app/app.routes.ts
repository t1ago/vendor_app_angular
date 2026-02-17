import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    redirectTo: '/category/form',
  },
  {
    path: 'category',
    loadChildren: () => import('./features/products/category/routes/category.routes').then((m) => m.categoryRoutes),
  },
  {
    path: 'coin',
    loadChildren: () => import('./features/products/coin/routes/coin.routes').then((m) => m.coinRoutes),
  },
];
