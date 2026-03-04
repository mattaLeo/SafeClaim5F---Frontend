import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth';

// note: service is named AuthService in implementation


describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
