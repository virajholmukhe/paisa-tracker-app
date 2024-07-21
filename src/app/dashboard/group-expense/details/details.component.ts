import { Component, Input, OnInit } from '@angular/core';
import { GroupExpense } from '../../../models/group-expense';
import { initFlowbite, Modal, ModalInterface } from 'flowbite';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JwtUtils } from '../../../utils/jwtUtils';
import { Expense } from '../../../models/expense';
import { GroupExpenseService } from '../../../services/group-expense.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterModule, CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit{
  
  @Input()
  groupExpense!: GroupExpense;
  addExpenseForm!: FormGroup;
  errorMessage: string = '';

  addExpenseModal!: ModalInterface;
  // settleupModal!: ModalInterface;
  // viewModal!: ModalInterface;

  constructor(private formBuilder: FormBuilder, private router: Router, private groupExpenseService: GroupExpenseService){ }

  ngOnInit(): void {
    initFlowbite();

    this.addExpenseForm = this.formBuilder.group({
      name:['', [Validators.required, Validators.pattern("^[a-zA-Z\\s]*$")]],
      amount: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      category: ['', [Validators.required]],
      description:['', [Validators.pattern("^[a-zA-Z\\s]+$")]],
      members: this.formBuilder.array([], [Validators.required])
    });

    const $modalElement1: HTMLElement = document.querySelector('#addExpenseModal') as HTMLElement;
    this.addExpenseModal = new Modal($modalElement1, {}, {});
    // const $modalElement2: HTMLElement = document.querySelector('#settleupModal') as HTMLElement;
    // this.settleupModal = new Modal($modalElement2, {}, {});
    // const $modalElement3: HTMLElement = document.querySelector('#viewModal') as HTMLElement;
    // this.viewModal = new Modal($modalElement3, {}, {});
  }

  addExpense(){
    var expense = {} as Expense;
    expense.paidTo = this.addExpenseForm.get('members')?.value;
    expense.amount = this.addExpenseForm.get('amount')?.value;
    expense.unsettledAmount = this.addExpenseForm.get('amount')?.value;
    expense.expenseCategory = this.addExpenseForm.get('category')?.value;
    expense.description = this.addExpenseForm.get('description')?.value;
    expense.expenseOwner = JwtUtils.getUsername() as string;
    expense.paidBy = JwtUtils.getUsername() as string;
    
    this.groupExpenseService.addExpense(expense, this.groupExpense.expenseGroupId).subscribe({
      next: res => {
        console.log(res);
      },
      error: err => this.errorMessage = err,
      complete: () => {
        this.getGroupExpense(),
        this.addExpenseForm.reset();
      }
    });
    this.addExpenseModal.hide();
  }

  getGroupExpense(){
    this.groupExpenseService.getGroupExpense(this.groupExpense.expenseGroupId).subscribe({
      next: res => this.groupExpense = res,
      error: err => this.errorMessage = err,
      complete: () => console.log("groupExpense updated")
    })
  }

  onChangeCheckBox(event: any){
    const checkedValue = event.target.value;
    const checked = event.target.checked;
    const checkedArray = this.addExpenseForm.get('members') as FormArray;
    if(checked){
      checkedArray.push(new FormControl(checkedValue));
    }else{
      let i: number = 0;
      checkedArray.controls.forEach((item) => {
        if(item.value == checkedValue){
          checkedArray.removeAt(i);
        }
        i++;
      })
    }
    console.log(event.target.value, event.target.checked);
  }


  hideModal(modalId: string){
    // if(modalId === "view"){
    //   this.viewModal.hide();
    // }
    switch(modalId) { 
      case "addExpenseModal": { 
        this.addExpenseModal.hide();
         break; 
      } 
      // case "settleupModal": { 
      //   this.settleupModal.hide();
      //   break; 
      // }
      // case "viewModal": { 
      //   this.viewModal.hide();
      //   break; 
      // } 
    }
  }

  showModal(modalId: string){
    switch(modalId) { 
      case "addExpenseModal": { 
        this.addExpenseModal.show();
        break; 
      } 
      // case "settleupModal": { 
      //   this.settleupModal.show();
      //   break; 
      // }
      // case "viewModal": { 
      //   this.viewModal.show();
      //   break; 
      // } 
    }
  }



}
