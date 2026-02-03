import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { CategoryService } from '../services/category-service';
import { catchError, EMPTY } from 'rxjs';

export const categoryDataAllResolver: ResolveFn<any> = (route, _state) => {
  const service = inject(CategoryService);

  return service.getAll();
};
