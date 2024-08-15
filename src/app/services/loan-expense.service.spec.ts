import { TestBed } from '@angular/core/testing';

import { LoanExpenseService } from './loan-expense.service';

describe('LoanExpenseService', () => {
  let service: LoanExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanExpenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
