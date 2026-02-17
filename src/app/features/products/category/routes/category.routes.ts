import { Routes } from '@angular/router';
import { categoryDataIdResolver } from './category-data-id-resolver';
import { categoryDataAllResolver } from './category-data-all-resolver';

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
