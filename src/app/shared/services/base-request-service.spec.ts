import { TestBed } from '@angular/core/testing';

import { BaseRequestService } from './base-request-service';
import { EnvironmentInjector, Injectable, Injector, runInInjectionContext } from '@angular/core';

describe('BaseRequestService', () => {
  let service: TestService;
  let injector: EnvironmentInjector;
  let consoleSpy: any;

  beforeEach(() => {
    const parentInjector = Injector.create({
      providers: [],
    });

    injector = TestBed.inject(EnvironmentInjector);

    runInInjectionContext(injector, () => {
      service = new TestService();
    });

    consoleSpy = vi.spyOn(console, 'log');
  });

  it('should create an instance', () => {
    // THEN
    expect(service).toBeTruthy();
  });

  it('should verify erros', () => {
    // THEN
    runInInjectionContext(injector, () => {
      expect(() => service.save({} as TestServiceModel)).toThrowError('Method not implemented.');
      expect(() => service.mapDto({} as TestServiceModel)).toThrowError('Method not implemented.');
      expect(() => service.mapModel({} as ITestServiceDto)).toThrowError('Method not implemented.');
    });
  });

  it('should log default error catch', () => {
    // GIVEN
    const errorMock = { message: 'test' };

    // WHEN
    service.defaultError(errorMock);

    // THEN
    runInInjectionContext(injector, () => {
      expect(consoleSpy).toHaveBeenCalledWith(errorMock);
    });
  });
});

@Injectable({
  providedIn: 'root',
})
class TestService extends BaseRequestService<TestServiceModel, ITestServiceDto> {}

interface TestServiceModel {}

interface ITestServiceDto {}
