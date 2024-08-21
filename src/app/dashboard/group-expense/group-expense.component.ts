import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { initFlowbite, Modal, ModalInterface } from 'flowbite';
import { GroupExpense } from '../../models/group-expense';
import { GroupExpenseService } from '../../services/group-expense.service';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DetailsComponent } from "./details/details.component";

@Component({
  selector: 'app-group-expense',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterModule, CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, DetailsComponent],
  templateUrl: './group-expense.component.html',
  styleUrl: './group-expense.component.css'
})
export class GroupExpenseComponent implements OnInit{

  groupMembersList!: Array<string>;
  groupExpenseForm!: FormGroup;
  errorMessage!: string;
  groupExpensesList: Array<GroupExpense> = new Array<GroupExpense>;
  groupExpense: GroupExpense = {} as GroupExpense;
  expenseGroupId: number = 0;

  addGroupExpenseModal!: ModalInterface;
  deleteGroupModal!: ModalInterface;

  constructor(private formBuilder: FormBuilder, private groupExpenseService: GroupExpenseService){}

  ngOnInit(): void {
    initFlowbite();
    this.getGroupExpenseList();
    
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

    const $modalElement1: HTMLElement = document.querySelector('#addGroupExpenseModal') as HTMLElement;
    this.addGroupExpenseModal = new Modal($modalElement1, {}, {});

    const $modalElement2: HTMLElement = document.querySelector('#deleteGroupModal') as HTMLElement;
    this.deleteGroupModal = new Modal($modalElement2, {}, {});

    this.groupMembersList = [];
    this.errorMessage = '';
  }
  createGroup(){
    var groupExpense = {} as GroupExpense;
    groupExpense.groupName = this.groupExpenseForm.get('groupName')?.value;
    groupExpense.groupMembers = this.groupMembersList;
    this.groupExpenseService.createGroupExpense(groupExpense).subscribe({
      next: res => console.log(res),
      error: err => this.errorMessage = err,
      complete: () => {
        this.getGroupExpenseList(),
        this.groupExpenseForm.reset();
      }
    });
    this.groupMembersList = [];
    this.addGroupExpenseModal.hide();
  }

  loadGroupExpense(groupExpense: GroupExpense){
    this.groupExpense = groupExpense;
    
  }
  

  addMemberToList(name: string){
    if(name.length > 0){
      this.groupMembersList.push(name);
    }
  }

  removeMemberFromList(name: string){
    const index: number = this.groupMembersList.indexOf(name);
    if(index !== -1) {
        this.groupMembersList.splice(index, 1);
    }
  }

  getGroupExpenseList(){
    this.groupExpenseService.getGroupExpenses().subscribe({
      next: res => this.groupExpensesList = res,
      error: err => this.errorMessage = err,
      complete: () => {
        console.log("getGroupExpenseList() Completed"),
        this.loadGroupExpense(this.groupExpensesList[0]);
      }
    });
  }

  removeGroup(groupExpense: GroupExpense){
    this.loadGroupExpense(groupExpense);
    this.deleteGroupModal.show();
  }
 
  deleteGroup(){
    this.groupExpenseService.removeExpense(Number(this.groupExpense.groupId)).subscribe({
      next: res => console.log(res),
      error: err => this.errorMessage = err,
      complete: () => {
        this.getGroupExpenseList(),
        this.deleteGroupModal.hide();
      }
    });
  }

  hideModal(modalId: string){
    switch(modalId) { 
      case "addGroupExpenseModal": { 
        this.addGroupExpenseModal.hide();
         break; 
      }
      case "deleteGroupModal": { 
        this.deleteGroupModal.hide();
         break; 
      }
    }
  }

  showModal(modalId: string){
    switch(modalId) { 
      case "addGroupExpenseModal": { 
        this.addGroupExpenseModal.show();
        break; 
      }
      case "deleteGroupModal": { 
        this.deleteGroupModal.show();
        break; 
      }
    }
  }

}
