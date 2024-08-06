import { AfterViewChecked, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { initFlowbite, initModals } from 'flowbite';
import { Expense } from '../../models/expense';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { PersonalExpenseServiceService } from '../../services/personal-expense-service.service';
import { JwtUtils } from '../../utils/jwtUtils';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlowbiteService } from '../../services/flowbite.service';

import { Modal } from 'flowbite';
import type { ModalOptions, ModalInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-personal-expense',
  standalone: true, 
  imports: [RouterOutlet, RouterLink, RouterModule, CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './personal-expense.component.html',
  styleUrl: './personal-expense.component.css'
})
export class PersonalExpenseComponent implements OnInit{

  addExpenseForm!: FormGroup;
  editExpenseForm!: FormGroup;
  expenseForm!: FormGroup;

  @Input()
  expenseList!: Array<Expense>;

  @Output() 
  expenseListChange = new EventEmitter<Array<Expense>>();

  expense: Expense = {} as Expense;
  errorMessage: string = '';

  addExpenseModal!: ModalInterface;
  settleupModal!: ModalInterface;
  viewModal!: ModalInterface;

  constructor(private formBuilder: FormBuilder, private router: Router, private service: PersonalExpenseServiceService, private flowbiteService: FlowbiteService){}

  ngOnInit(): void {
    initFlowbite();
    // this.getExpenseList();

    this.addExpenseForm = this.formBuilder.group({
      name:['', [Validators.required, Validators.pattern("^[a-zA-Z\\s]*$")]],
      amount: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      category: ['', [Validators.required]],
      description:['', [Validators.pattern("^[a-zA-Z\\s]+$")]]
    });
    this.editExpenseForm = this.formBuilder.group({
      name:['', [Validators.required, Validators.pattern("^[a-zA-Z\\s]*$")]],
      expenseId:['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      totalAmount: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      unsettledAmount: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      settledAmount: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      unsettledAmountChange: ['']
    });
    this.expenseForm = this.formBuilder.group({
      name:['', [Validators.required, Validators.pattern("^[a-zA-Z\\s]*$")]],
      amount: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      unsettledAmount: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      category: ['', [Validators.required]],
      description:['', [Validators.pattern("^[a-zA-Z\\s]+$")]],
    });

    const $modalElement1: HTMLElement = document.querySelector('#addExpenseModal') as HTMLElement;
    this.addExpenseModal = new Modal($modalElement1, {}, {});
    const $modalElement2: HTMLElement = document.querySelector('#settleupModal') as HTMLElement;
    this.settleupModal = new Modal($modalElement2, {}, {});
    const $modalElement3: HTMLElement = document.querySelector('#viewModal') as HTMLElement;
    this.viewModal = new Modal($modalElement3, {}, {});
    
    this.errorMessage = '';
  }

  viewExpense(expense: Expense){
    this.expense = expense;
    if(expense.expenseCategory.match('Borrow|Lend')){
      
    }
    // if(expense.paidTo?.length){
    //   this.expenseForm.controls['name'].setValue(expense.paidTo[0]);
    //   this.expenseForm.controls['amount'].setValue(expense.amount);
    //   this.expenseForm.controls['unsettledAmount'].setValue(expense.unsettledAmount);
    //   this.expenseForm.controls['category'].setValue(expense.expenseCategory);
    //   this.expenseForm.controls['description'].setValue(expense.description);
    // }
    this.viewModal.show();

  }

  hideModal(modalId: string){
    switch(modalId) { 
      case "addExpenseModal": { 
        this.addExpenseModal.hide();
         break; 
      } 
      case "settleupModal": { 
        this.settleupModal.hide();
        break; 
      }
      case "viewModal": { 
        this.viewModal.hide();
        break; 
      } 
    }
  }

  showModal(modalId: string){
    switch(modalId) {
      case "addExpenseModal": { 
        this.addExpenseModal.show();
        break; 
      } 
      case "settleupModal": { 
        this.settleupModal.show();
        break; 
      }
      case "viewModal": { 
        this.viewModal.show();
        break; 
      } 
    }
  }

  addExpense(){
    var expense = {} as Expense;
    expense.paidTo = [];
    expense.paidTo.push(this.addExpenseForm.get('name')?.value);
    expense.amount = this.addExpenseForm.get('amount')?.value;
    expense.unsettledAmount = this.addExpenseForm.get('amount')?.value;
    expense.expenseCategory = this.addExpenseForm.get('category')?.value;
    expense.description = this.addExpenseForm.get('description')?.value;
    expense.expenseOwner = JwtUtils.getUsername() as string;
    if(expense.expenseCategory == 'Borrow'){
      expense.paidBy = expense.paidTo[0];
      expense.paidTo = [JwtUtils.getUsername() as string];
    }else {
      expense.paidBy = JwtUtils.getUsername() as string;
    }
    

    this.service.addExpense(expense).subscribe({
      next: expense => {
        this.expense = expense;
      },
      error: err => this.errorMessage = err,
      complete: () => {
        this.getExpenseList(),
        this.addExpenseForm.reset();
      },
    })
  }

  getExpenseList(){
    console.log("getExpenseList() method called");
    this.service.getExpenseList().subscribe({
      next: res => this.expenseList = res,
      error: err => this.errorMessage = err,
      complete: () => {
        console.log("Call is completed"),
        this.expenseListChange.emit(this.expenseList);
      }
    });
  }

  removeExpense(expenseId: number){
    console.log(expenseId);
    this.service.removeExpense(Number(expenseId)).subscribe({
      next: res => console.log(res),
      error: err => this.errorMessage = err,
      complete: () => {
        this.getExpenseList()
      }
    });
  }

  settleUpExpense(expense: Expense){
    // console.log(expense);
    if(expense.paidTo?.length){
      this.editExpenseForm.controls['name'].setValue(expense.paidTo[0]);
      this.editExpenseForm.controls['expenseId'].setValue(expense.expenseId);
      this.editExpenseForm.controls['totalAmount'].setValue(expense.amount);
      this.editExpenseForm.controls['unsettledAmount'].setValue(expense.unsettledAmount);
    }
    this.settleupModal.show();
  }

  editExpense(){
    let settledAmount:number = this.editExpenseForm.controls['settledAmount'].value;
    let expenseId: number = this.editExpenseForm.controls['expenseId'].value;
    this.service.settleUpExpense(expenseId, settledAmount).subscribe({
      next: res => console.log(res),
      error: err => this.errorMessage = err,
      complete: () => {
        this.getExpenseList(),
        this.editExpenseForm.reset();
      }
    });
    this.settleupModal.hide();
  }

}
