import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@shared/components/toast/services/toast-service';
import { Mocked } from 'vitest';
import { MeasureService } from '../services/measure-service';
import { MeasureForm } from './measure-form';

describe('MeasureForm', () => {
    let component: MeasureForm;
    let fixture: ComponentFixture<MeasureForm>;

    const measureServiceStub: Partial<Mocked<MeasureService>> = {
        save: vi.fn(),
    };

    const toastServiceStub: Partial<Mocked<ToastService>> = {
        show: vi.fn(),
    };

    const translateServiceStub = {
        instant: vi.fn((key: string) => key),
    };

    const routerStub = {
        navigate: vi.fn(),
    };

    const activatedRouteStub = {
        snapshot: { data: {} },
    };

    beforeEach(() => {
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            imports: [MeasureForm],
            providers: [
                provideRouter([]),
                { provide: Router, useValue: routerStub },
                { provide: MeasureService, useValue: measureServiceStub },
                { provide: ToastService, useValue: toastServiceStub },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                { provide: TranslateService, useValue: translateServiceStub },
            ],
        });

        fixture = TestBed.createComponent(MeasureForm);
        component = fixture.componentInstance;
    });

    it('should create', () => expect(component).toBeTruthy());
});
