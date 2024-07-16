import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmiExpenseComponent } from './emi-expense.component';

describe('EmiExpenseComponent', () => {
  let component: EmiExpenseComponent;
  let fixture: ComponentFixture<EmiExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmiExpenseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmiExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
