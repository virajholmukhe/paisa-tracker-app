import { TestBed } from '@angular/core/testing';
import { PersonalExpenseServiceService } from './personal-expense-service.service';


describe('PersonalExpenseServiceService', () => {
  let service: PersonalExpenseServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalExpenseServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
