import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeasureList } from './measure-list';

describe('MeasureList', () => {
    let component: MeasureList;
    let fixture: ComponentFixture<MeasureList>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [MeasureList] }).compileComponents();
        fixture = TestBed.createComponent(MeasureList);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => expect(component).toBeTruthy());
});
