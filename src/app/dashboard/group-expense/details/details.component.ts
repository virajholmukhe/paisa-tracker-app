import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Group } from '../../../models/group';
import { initFlowbite, Modal, ModalInterface } from 'flowbite';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JwtUtils } from '../../../utils/jwtUtils';
import { GroupExpense } from '../../../models/group-expense';
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
  groupExpense!: Group;
  expense: GroupExpense = {} as GroupExpense;
  addExpenseForm!: FormGroup;
  groupExpenseForm!: FormGroup;
  errorMessage: string = '';
  groupMembersList!: Array<string>;
  username: string = '';

  createExpenseModal!: ModalInterface;
  viewExpenseModal!: ModalInterface;

  constructor(private formBuilder: FormBuilder, private router: Router, private groupExpenseService: GroupExpenseService){ }

  ngOnInit(): void {
    initFlowbite();
    this.username = JwtUtils.getUsername() as string;
    this.addExpenseForm = this.formBuilder.group({
      name:['', [Validators.required, Validators.pattern("^[a-zA-Z\\s]*$")]],
      amount: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      category: ['', [Validators.required]],
      description:['', [Validators.pattern("^[a-zA-Z\\s]+$")]],
      members: this.formBuilder.array([], [Validators.required])
    });

    this.groupExpenseForm = this.formBuilder.group({
      groupName: ['', [Validators.required, Validators.pattern("^[a-zA-Z\\s]*$")]],
      groupMembers: [''],
      expense: this.formBuilder.group({
        expenseId: [''],
        expenseOwner:['', [Validators.pattern("^[a-zA-Z\\s]*$")]],
        paidBy:['', [Validators.pattern("^[a-zA-Z\\s]*$")]],
        amount: ['', [Validators.pattern("^[0-9]+$")]],
        unsettledAmount: ['', [Validators.pattern("^[0-9]+$")]],
        expenseCategory: ['', []],
        description:['', [Validators.pattern("^[a-zA-Z\\s]+$")]],
        paidTo: ['']
      }),
      totalOutstanding: ['']
    });

    this.groupMembersList = this.groupExpense.members;

    const $modalElement1: HTMLElement = document.querySelector('#createExpenseModal') as HTMLElement;
    this.createExpenseModal = new Modal($modalElement1, {}, {});
    const $modalElement3: HTMLElement = document.querySelector('#viewExpenseModal') as HTMLElement;
    this.viewExpenseModal = new Modal($modalElement3, {}, {});
  }

  addExpense(){
    var expense = {} as GroupExpense;
    expense.paidTo = this.addExpenseForm.get('members')?.value;
    expense.paidTo.push(this.username);
    expense.amount = this.addExpenseForm.get('amount')?.value;
    expense.unsettledAmount = (this.addExpenseForm.get('amount')?.value) / (expense.paidTo.length + 1);
    expense.category = this.addExpenseForm.get('category')?.value;
    expense.description = this.addExpenseForm.get('description')?.value;
    expense.owner = this.username;
    expense.paidBy = this.username;
    
    this.groupExpenseService.addExpense(expense, this.groupExpense.id).subscribe({
      next: res => {
        console.log(res);
      },
      error: err => this.errorMessage = err,
      complete: () => {
        this.getGroupExpense()
      }
    });
    this.createExpenseModal.hide();
  }

  getGroupExpense(){
    this.groupExpenseService.getGroup(this.groupExpense.id).subscribe({
      next: res => this.groupExpense = res,
      error: err => this.errorMessage = err,
      complete: () => console.log("groupExpense updated")
    });
  }

  viewExpenseDetails(expense: GroupExpense){
    this.loadExpense(expense);
    this.viewExpenseModal.show();
  }

  loadExpense(expense: GroupExpense){
    this.expense = expense;
  }

  removeExpense(expenseId: number){
    this.groupExpenseService.removeExpense(Number(this.groupExpense.id), expenseId).subscribe({
      next: res => console.log(res),
      error: err => this.errorMessage = err,
      complete: () => {
        this.getGroupExpense();
      }
    });
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
  }

  hideModal(modalId: string){
    switch(modalId) { 
      case "createExpenseModal": { 
        this.createExpenseModal.hide();
         break; 
      }
      case "viewExpenseModal": { 
        this.viewExpenseModal.hide();
        break; 
      }
    }
  }
  
  showModal(modalId: string){
    switch(modalId) { 
      case "createExpenseModal": { 
        this.createExpenseModal.show();
        break; 
      }
      case "viewExpenseModal": { 
        this.viewExpenseModal.show();
        break; 
      }
    }
  }
  
  
}
