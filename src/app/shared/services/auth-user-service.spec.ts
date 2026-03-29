import { TestBed } from '@angular/core/testing';

import { AuthUserService } from '@shared/services/auth-user-service';

describe('UserService', () => {
    let service: AuthUserService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AuthUserService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
