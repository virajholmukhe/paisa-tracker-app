import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalExpenseComponent } from './personal-expense.component';

describe('PersonalExpenseComponent', () => {
  let component: PersonalExpenseComponent;
  let fixture: ComponentFixture<PersonalExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalExpenseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersonalExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
