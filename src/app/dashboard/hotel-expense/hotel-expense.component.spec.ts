import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelExpenseComponent } from './hotel-expense.component';

describe('HotelExpenseComponent', () => {
  let component: HotelExpenseComponent;
  let fixture: ComponentFixture<HotelExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelExpenseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HotelExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
