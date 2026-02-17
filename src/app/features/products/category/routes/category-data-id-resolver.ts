import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { CategoryService } from '../services/category-service';
import { catchError, EMPTY } from 'rxjs';

export const categoryDataIdResolver: ResolveFn<any> = (route, _state) => {
  const service = inject(CategoryService);
  const router = inject(Router);

  const id = route.paramMap.get('id');

  if (id) {
    return service.getById(id);
  } else {
    router.navigateByUrl('/category/form');
    return EMPTY;
  }
};
