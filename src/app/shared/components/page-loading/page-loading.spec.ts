import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageLoading } from './page-loading';

describe('PageLoading', () => {
    let component: PageLoading;
    let fixture: ComponentFixture<PageLoading>;

    beforeEach(() => {
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            imports: [PageLoading],
        });

        fixture = TestBed.createComponent(PageLoading);
        component = fixture.componentInstance;
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should render loading when isLoading is true', () => {
        // GIVEN
        fixture.componentRef.setInput('isLoading', true);

        // WHEN
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const spinner = compiled.querySelector('.spinner-border');

        // THEN
        expect(spinner).toBeTruthy();
    });

    it('should not render loading when isLoading is false', () => {
        // GIVEN
        fixture.componentRef.setInput('isLoading', false);

        // WHEN
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const spinner = compiled.querySelector('.spinner-border');

        // THEN
        expect(spinner).toBeNull();
    });
});
