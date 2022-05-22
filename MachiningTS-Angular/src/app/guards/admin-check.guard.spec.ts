import { TestBed } from '@angular/core/testing';

import { AdminCheckGuard } from './admin-check.guard';

describe('AdminCheckGuard', () => {
  let guard: AdminCheckGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminCheckGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
