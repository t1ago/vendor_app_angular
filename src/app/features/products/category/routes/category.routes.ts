import { Routes } from '@angular/router';
import { categoryResolver } from './category-data-resolver';

export const categoryRoutes: Routes = [
  {
    path: 'form',
    loadComponent: () => import('../form/category-form').then((m) => m.CategoryForm),
  },
  {
    path: 'form/:id',
    loadComponent: () => import('../form/category-form').then((m) => m.CategoryForm),
    resolve: {
      data: categoryResolver,
    },
  },
  {
    path: 'list',
    loadComponent: () => import('../list/category-list').then((m) => m.CategoryList),
  },
];
