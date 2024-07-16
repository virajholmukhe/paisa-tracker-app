import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { GroupExpense } from '../../models/group-expense';
import { GroupExpenseService } from '../../services/group-expense.service';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-group-expense',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterModule, CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './group-expense.component.html',
  styleUrl: './group-expense.component.css'
})
export class GroupExpenseComponent implements OnInit{

  groupMembersList!: Array<string>;
  groupExpenseForm!: FormGroup;
  errorMessage!: string;
  groupExpensesList!: Array<GroupExpense>;
  successPopUp: boolean = false;

  constructor(private formBuilder: FormBuilder, private groupExpenseService: GroupExpenseService){}

  ngOnInit(): void {
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
    this.groupMembersList = [];
    this.errorMessage = '';
  }

  createGroup(){
    var groupExpense = {} as GroupExpense;
    groupExpense.groupName = this.groupExpenseForm.get('groupName')?.value;
    groupExpense.groupMembers = this.groupMembersList;
    this.groupExpenseService.createGroupExpense(groupExpense).subscribe({
      next: res => console.log(res),
      error: err => this.errorMessage = err
    });
    this.successPopUp = true;
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
      error: err => this.errorMessage = err
    });
  }

  deleteGroup(expenseGroupId: number){
    console.log(expenseGroupId);
    this.groupExpenseService.removeExpense(Number(expenseGroupId)).subscribe({
      error: err => this.errorMessage = err
    });
    window.location.reload();
  }

}
