import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MeasureService } from '../services/measure-service';

export const measureDataAllResolver: ResolveFn<any> = (_route, _state) => {
    return inject(MeasureService).getAll();
};
