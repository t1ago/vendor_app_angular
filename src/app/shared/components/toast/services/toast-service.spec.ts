import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastService } from './toast-service';

describe('ToastService', () => {
    let service: ToastService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ToastService],
        });

        service = TestBed.inject(ToastService);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be created with default values', () => {
        expect(service.message()).toBeNull();
        expect(service.type()).toBe('info');
        expect(service.title()).toBe('Sistema');
    });

    it('should show a toast with correct title and message', () => {
        service.show('Operação realizada', 'success');

        expect(service.message()).toBe('Operação realizada');
        expect(service.type()).toBe('success');
        expect(service.title()).toBe('Sucesso');
    });

    it('should set the title to "Erro" when type is danger', () => {
        service.show('Falha crítica', 'danger');

        expect(service.type()).toBe('danger');
        expect(service.title()).toBe('Erro');
    });

    it('should clear the message when clear() is called', () => {
        service.show('Mensagem');
        service.clear();

        expect(service.message()).toBeNull();
    });

    it('should automatically clear the toast after timeout', () => {
        const timeout = 5000;
        service.show('Mensagem temporária', 'info', timeout);

        expect(service.message()).toBe('Mensagem temporária');

        vi.advanceTimersByTime(timeout);

        expect(service.message()).toBeNull();
    });

    it('should use default timeout of 3000ms if not provided', () => {
        service.show('Default timeout');

        expect(service.message()).toBe('Default timeout');

        vi.advanceTimersByTime(3000);

        expect(service.message()).toBeNull();
    });
});
