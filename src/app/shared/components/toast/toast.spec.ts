import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastService } from './services/toast-service';
import { Toast } from './toast';

describe('Toast', () => {
    let component: Toast;
    let fixture: ComponentFixture<Toast>;
    let toastService: ToastService;

    beforeEach(() => {
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            imports: [Toast],
            providers: [ToastService],
        });

        fixture = TestBed.createComponent(Toast);
        component = fixture.componentInstance;
        toastService = TestBed.inject(ToastService);
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('should not render toast when there is no message', () => {
        // GIVEN
        toastService.clear();

        // WHEN
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const toast = compiled.querySelector('.toast');

        // THEN
        expect(toast).toBeNull();
    });

    it('should render toast when message is set', () => {
        // GIVEN
        toastService.show('Hello world', 'info', 999999);

        // WHEN
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const toast = compiled.querySelector('.toast');
        const body = compiled.querySelector('.toast-body');

        // THEN
        expect(toast).toBeTruthy();
        expect(body?.textContent).toContain('Hello world');
    });

    it('should apply success class', () => {
        // GIVEN
        toastService.show('Success message', 'success', 999999);

        // WHEN
        fixture.detectChanges();

        const header = fixture.nativeElement.querySelector('.toast-header');

        // THEN
        expect(header.className).toContain('bg-success');
    });

    it('should apply danger class', () => {
        // GIVEN
        toastService.show('Error message', 'danger', 999999);

        // WHEN
        fixture.detectChanges();

        const header = fixture.nativeElement.querySelector('.toast-header');

        // THEN
        expect(header.className).toContain('bg-danger');
    });

    it('should apply info class', () => {
        // GIVEN
        toastService.show('Info message', 'info', 999999);

        // WHEN
        fixture.detectChanges();

        const header = fixture.nativeElement.querySelector('.toast-header');

        // THEN
        expect(header.className).toContain('bg-info');
    });

    it('should render correct title based on type', () => {
        // GIVEN
        toastService.show('Success message', 'success', 999999);

        // WHEN
        fixture.detectChanges();

        const title = fixture.nativeElement.querySelector('.toast-header strong');

        // THEN
        expect(title.textContent).toContain('Sucesso');
    });

    it('should clear toast when close button is clicked', () => {
        // GIVEN
        toastService.show('Close me', 'info', 999999);

        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector('.btn-close');

        // WHEN
        button.click();
        fixture.detectChanges();

        const toast = fixture.nativeElement.querySelector('.toast');

        // THEN
        expect(toast).toBeNull();
    });
});
