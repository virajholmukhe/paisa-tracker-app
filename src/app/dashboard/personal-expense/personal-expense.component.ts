import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { PersonalExpenseService } from '../../services/personal-expense-service.service';
import { JwtUtils } from '../../utils/jwtUtils';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { Modal } from 'flowbite';
import type { ModalInterface } from 'flowbite';
import { PersonalExpense } from '../../models/personal-expense';

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

  expenseList: Array<PersonalExpense> = {} as Array<PersonalExpense>;
  expense: PersonalExpense = {} as PersonalExpense;
  expenseId: number = 0;
  errorMessage: string = '';

  addExpenseModal!: ModalInterface;
  settleupModal!: ModalInterface;
  viewModal!: ModalInterface;
  deleteModal!: ModalInterface;

  constructor(
    private formBuilder: FormBuilder,
    private personalExpenseService: PersonalExpenseService,
  ){}

  ngOnInit(): void {
    initFlowbite();
    this.getExpenseList();
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

    const $modalElement1: HTMLElement = document.querySelector('#addExpenseModal') as HTMLElement;
    this.addExpenseModal = new Modal($modalElement1, {}, {});
    const $modalElement2: HTMLElement = document.querySelector('#settleupModal') as HTMLElement;
    this.settleupModal = new Modal($modalElement2, {}, {});
    const $modalElement3: HTMLElement = document.querySelector('#viewModal') as HTMLElement;
    this.viewModal = new Modal($modalElement3, {}, {});
    const $modalElement4: HTMLElement = document.querySelector('#deleteModal') as HTMLElement;
    this.deleteModal = new Modal($modalElement4, {}, {});
    
  }
  
  addExpense(){
    var expense = {} as PersonalExpense;
    expense.amount = this.addExpenseForm.get('amount')?.value;
    expense.unsettledAmount = this.addExpenseForm.get('amount')?.value;
    expense.category = this.addExpenseForm.get('category')?.value;
    expense.description = this.addExpenseForm.get('description')?.value;
    expense.owner = JwtUtils.getUsername() as string;
    if(expense.category == 'Borrow'){
      expense.paidBy = this.addExpenseForm.get('name')?.value;
      expense.paidTo = JwtUtils.getUsername() as string;
    }else {
      expense.paidBy = JwtUtils.getUsername() as string;
      expense.paidTo = this.addExpenseForm.get('name')?.value;
    }
    let usernameIsAvailable = false;
    this.personalExpenseService.addExpense(expense).subscribe({
      next: expense => {
        this.expense = expense;
      },
      error: err => this.errorMessage = err,
      complete: () => {
        this.getExpenseList(),
        this.addExpenseModal.hide(),
        this.addExpenseForm.reset();
      },
    })
  }

  viewExpense(expense: PersonalExpense){
    this.expense = expense;
    this.viewModal.show();
  }
  
  
  getExpenseList(){
    console.log("getExpenseList() method called");
    this.personalExpenseService.getExpenseList().subscribe({
      next: res => this.expenseList = res,
      error: err => this.errorMessage = err,
      complete: () => {
        console.log("Call is completed");
      }
    });
  }
  
  removeExpense(expenseId: number){
    this.expenseId = expenseId;
    this.deleteModal.show();
  }

  deleteExpense(){
    console.log(this.expenseId);
    this.personalExpenseService.removeExpense(Number(this.expenseId)).subscribe({
      next: res => console.log(res),
      error: err => this.errorMessage = err,
      complete: () => {
        this.getExpenseList()
      }
    });
    this.deleteModal.hide();
  }
  
  settleUpExpense(expense: PersonalExpense){
    if(expense.paidTo?.length){
      this.editExpenseForm.controls['name'].setValue(expense.paidTo);
      this.editExpenseForm.controls['expenseId'].setValue(expense.id);
      this.editExpenseForm.controls['totalAmount'].setValue(expense.amount);
      this.editExpenseForm.controls['unsettledAmount'].setValue(expense.unsettledAmount);
    }
    this.settleupModal.show();
  }
  
  editExpense(){
    let settledAmount:number = this.editExpenseForm.controls['settledAmount'].value;
    let expenseId: number = this.editExpenseForm.controls['expenseId'].value;
    this.personalExpenseService.settleUpExpense(expenseId, settledAmount).subscribe({
      next: res => console.log(res),
      error: err => this.errorMessage = err,
      complete: () => {
        this.getExpenseList(),
        this.editExpenseForm.reset();
      }
    });
    this.settleupModal.hide();
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
      case "deleteModal": { 
        this.deleteModal.hide();
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
      case "deleteModal": { 
        this.deleteModal.show();
        break; 
      }
    }
  }
}
