import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
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

  expenseList!: Expense[];

  expense!: Expense;
  errorMessage: string = '';
  toggleModal: string = '';

  dataRecieved: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private service: PersonalExpenseServiceService, private flowbiteService: FlowbiteService){}

  ngOnInit(): void {
    // initFlowbite();
    // window.addEventListener('load', function() {
    //   const modal = FlowbiteInstances.getInstance('Modal', 'modal-id');
    // })
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
    });
    
    this.expenseForm = this.formBuilder.group({
      name:['', [Validators.required, Validators.pattern("^[a-zA-Z\\s]*$")]],
      amount: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      unsettledAmount: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      category: ['', [Validators.required]],
      description:['', [Validators.pattern("^[a-zA-Z\\s]+$")]],
    });
    
  }

  viewExpense(expense: Expense){
    if(expense.paidTo?.length){
      this.expenseForm.controls['name'].setValue(expense.paidTo[0]);
      this.expenseForm.controls['amount'].setValue(expense.amount);
      this.expenseForm.controls['unsettledAmount'].setValue(expense.unsettledAmount);
      this.expenseForm.controls['category'].setValue(expense.expenseCategory);
      this.expenseForm.controls['description'].setValue(expense.description);
    }
    // const $modalElement: HTMLElement = document.querySelector('#view') as HTMLElement;
    // const modalOptions: ModalOptions = { 
    //   closable: true,
    // };
    // // instance options object
    // const instanceOptions: InstanceOptions = {
    //   id: 'view',
    //   override: false
    // };
    // const viewModal: ModalInterface = new Modal($modalElement, {}, {});
    // viewModal.toggle();
    
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
    expense.paidBy = JwtUtils.getUsername() as string;
    // console.log(expense);
    this.service.addExpense(expense).subscribe({
      next: expense => {
        this.expense = expense;
        // console.log(expense);
      },
      error: err => this.errorMessage = err,
      complete: () => this.getExpenseList()
    })
    // window.location.reload();
    // this.getExpenseList();
    // this.router.navigate(['/dashboard']);
  }

  getExpenseList(){
    console.log("getExpenseList method called");
    this.service.getExpenseList().subscribe({
      next: res => this.expenseList = res,
      error: err => this.errorMessage = err,
      complete: () => console.log("Call is completed")
    });
  }

  removeExpense(expenseId: number){
    console.log(expenseId);
    this.service.removeExpense(Number(expenseId)).subscribe({
      next: res => console.log(res),
      error: err => this.errorMessage = err,
      complete: () => this.getExpenseList()
    });
    // window.location.reload();

  }

  settleUpExpense(expense: Expense, isEditCompleted: boolean){
    console.log(expense);
    if(expense.paidTo?.length){
      this.editExpenseForm.controls['name'].setValue(expense.paidTo[0]);
      this.editExpenseForm.controls['expenseId'].setValue(expense.expenseId);
      this.editExpenseForm.controls['totalAmount'].setValue(expense.amount);
      this.editExpenseForm.controls['unsettledAmount'].setValue(expense.unsettledAmount);
    }
    
    
    if(isEditCompleted){
      let settledAmount = this.editExpenseForm.controls['unsettledAmount'].value;
      console.log(settledAmount);
      // this.service.editExpense
    }
  }

  editExpense(){
    let settledAmount:number = this.editExpenseForm.controls['settledAmount'].value;
    let expenseId: number = this.editExpenseForm.controls['expenseId'].value;
    this.service.settleUpExpense(expenseId, settledAmount).subscribe({
      error: err => this.errorMessage = err
    });
    window.location.reload();
  }

}
