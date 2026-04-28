import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { PageLoadingService } from './page-loading-service';

describe('PageLoadingService', () => {
    let service: PageLoadingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PageLoadingService],
        });

        service = TestBed.inject(PageLoadingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have isLoading as false by default', () => {
        expect(service.isLoading()).toBe(false);
    });

    it('should set isLoading to true when show() is called', () => {
        service.show();
        expect(service.isLoading()).toBe(true);
    });

    it('should set isLoading to false when hide() is called', () => {
        service.show();
        expect(service.isLoading()).toBe(true);

        service.hide();
        expect(service.isLoading()).toBe(false);
    });

    it('should maintain state correctly after multiple calls', () => {
        service.show();
        service.show();
        expect(service.isLoading()).toBe(true);

        service.hide();
        expect(service.isLoading()).toBe(false);
    });
});
