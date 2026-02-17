import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CategoryService } from '../services/category-service';

export const categoryDataAllResolver: ResolveFn<any> = (route, _state) => {
  const service = inject(CategoryService);

  return service.getAll();
};
