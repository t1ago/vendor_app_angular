import { TestBed } from '@angular/core/testing';
import { AuthStoreService } from './auth-store-service';

describe('AuthStoreService', () => {
    let service: AuthStoreService;

    beforeEach(() => {
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            providers: [AuthStoreService],
        });

        service = TestBed.inject(AuthStoreService);

        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set auth token and persist in storage', () => {
        // GIVEN
        const authToken = {
            token: 'abc123',
            expiresIn: 1,
        };

        const now = Date.now();

        vi.spyOn(Date, 'now').mockReturnValue(now);

        // WHEN
        service.setAuthToken(authToken);

        // THEN
        expect(service.token()).toBe('abc123');
        expect(service.expiresAt()).toBe(now + 1000);

        expect(localStorage.getItem('token')).toBe('abc123');
        expect(localStorage.getItem('expiresAt')).toBe(String(now + 1000));
    });

    it('should set user and persist in storage', () => {
        // GIVEN
        const user = { name: 'Tiago' };

        // WHEN
        service.setUser(user as any);

        // THEN
        expect(service.user()).toEqual(user);
        expect(localStorage.getItem('user')).toBe(JSON.stringify(user));
    });

    it('should load data from storage', () => {
        // GIVEN
        const token = 'abc123';
        const expiresAt = '9999999999999';
        const user = { name: 'Tiago' };

        localStorage.setItem('token', token);
        localStorage.setItem('expiresAt', expiresAt);
        localStorage.setItem('user', JSON.stringify(user));

        // WHEN
        service.loadFromStorage();

        // THEN
        expect(service.token()).toBe(token);
        expect(service.expiresAt()).toBe(Number(expiresAt));
        expect(service.user()).toEqual(user);
    });

    it('should return token using getToken', () => {
        // GIVEN
        service.token.set('abc123');

        // WHEN
        const token = service.getToken();

        // THEN
        expect(token).toBe('abc123');
    });

    it('should logout and clear all data', () => {
        // GIVEN
        service.token.set('abc123');
        service.expiresAt.set(999);
        service.user.set({ name: 'Tiago' } as any);

        localStorage.setItem('token', 'abc123');
        localStorage.setItem('expiresAt', '999');
        localStorage.setItem('user', JSON.stringify({ name: 'Tiago' }));

        // WHEN
        service.logout();

        // THEN
        expect(service.token()).toBe('');
        expect(service.expiresAt()).toBe(0);
        expect(service.user()).toEqual({});

        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('expiresAt')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
    });

    it('should return true when token is expired', () => {
        // GIVEN
        const now = Date.now();

        vi.spyOn(Date, 'now').mockReturnValue(now);

        service.expiresAt.set(now - 1000);

        // WHEN
        const isExpired = service.isTokenExpired();

        // THEN
        expect(isExpired).toBe(true);
    });

    it('should return false when token is not expired', () => {
        // GIVEN
        const now = Date.now();

        vi.spyOn(Date, 'now').mockReturnValue(now);

        service.expiresAt.set(now + 1000);

        // WHEN
        const isExpired = service.isTokenExpired();

        // THEN
        expect(isExpired).toBe(false);
    });

    it('should return true when user is logged', () => {
        // GIVEN
        const now = Date.now();

        vi.spyOn(Date, 'now').mockReturnValue(now);

        service.token.set('abc123');
        service.expiresAt.set(now + 1000);

        // WHEN
        const isLogged = service.isLogged();

        // THEN
        expect(isLogged).toBe(true);
    });

    it('should return false when user is not logged', () => {
        // GIVEN
        service.token.set('');

        // WHEN
        const isLogged = service.isLogged();

        // THEN
        expect(isLogged).toBe(false);
    });

    it('should return true when expiresAt is zero (no expiration defined)', () => {
        // GIVEN
        service.expiresAt.set(0);

        // WHEN
        const isExpired = service.isTokenExpired();

        // THEN
        expect(isExpired).toBe(true);
    });
});
