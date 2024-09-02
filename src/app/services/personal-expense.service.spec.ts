import { TestBed } from '@angular/core/testing';
import { PersonalExpenseService } from './personal-expense-service.service';


describe('PersonalExpenseServiceService', () => {
  let service: PersonalExpenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalExpenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
