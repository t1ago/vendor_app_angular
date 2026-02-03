import { Routes } from '@angular/router';
import { categoryDataAllResolver } from './category-data-all-resolver';
import { categoryDataIdResolver } from './category-data-id-resolver copy';

export const categoryRoutes: Routes = [
  {
    path: 'form',
    loadComponent: () => import('../form/category-form').then((m) => m.CategoryForm),
  },
  {
    path: 'form/:id',
    loadComponent: () => import('../form/category-form').then((m) => m.CategoryForm),
    resolve: {
      data: categoryDataIdResolver,
    },
  },
  {
    path: 'list',
    loadComponent: () => import('../list/category-list').then((m) => m.CategoryList),
    resolve: {
      data: categoryDataAllResolver,
    },
  },
];
