import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { initFlowbite, Modal, ModalInterface } from 'flowbite';
import { Group } from '../../models/group';
import { GroupExpenseService } from '../../services/group-expense.service';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DetailsComponent } from "./details/details.component";
import { GroupExpense } from '../../models/group-expense';
import { JwtUtils } from '../../utils/jwtUtils';

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
  groupList: Array<Group> = new Array<Group>;
  group: Group = {} as Group;
  groupId: number = 0;
  username: string = '';

  addGroupModal!: ModalInterface;
  deleteGroupModal!: ModalInterface;
  editGroupModal!: ModalInterface;

  constructor(private formBuilder: FormBuilder, private groupExpenseService: GroupExpenseService){}

  ngOnInit(): void {
    initFlowbite();
    this.username = JwtUtils.getUsername() as string;
    this.group.expenseIds = [];
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

    const $modalElement1: HTMLElement = document.querySelector('#addGroupModal') as HTMLElement;
    this.addGroupModal = new Modal($modalElement1, {}, {});

    const $modalElement2: HTMLElement = document.querySelector('#deleteGroupModal') as HTMLElement;
    this.deleteGroupModal = new Modal($modalElement2, {}, {});

    const $modalElement3: HTMLElement = document.querySelector('#editGroupModal') as HTMLElement;
    this.editGroupModal = new Modal($modalElement3, {}, {});

    this.groupMembersList = [];
    this.errorMessage = '';
  }

  createGroup(){
    var groupExpense = {} as Group;
    groupExpense.name = this.groupExpenseForm.get('groupName')?.value;
    groupExpense.members = this.groupMembersList;
    groupExpense.members.push(JwtUtils.getUsername() as string);
    this.groupExpenseService.createGroup(groupExpense).subscribe({
      next: res => console.log(res),
      error: err => this.errorMessage = err,
      complete: () => {
        this.getGroupExpenseList(),
        this.groupExpenseForm.reset();
      }
    });
    this.groupMembersList = [];
    this.addGroupModal.hide();
  }

  loadGroupExpense(group: Group){
    this.group = group;
  }
  
  addMemberToList(name: string){
    if(name.length > 0){
      this.groupMembersList.push(name);
    }
  }

  removeMemberFromList(name: string){
    // console.log(this.username + "-"+ name);
    if(name != this.username){
      const index: number = this.groupMembersList.indexOf(name);
      if(index !== -1) {
        this.groupMembersList.splice(index, 1);
      }
    }
  }

  getGroupExpenseList(){
    this.groupExpenseService.getGroupList().subscribe({
      next: res => this.groupList = res,
      error: err => this.errorMessage = err,
      complete: () => {
        console.log("getGroupExpenseList() Completed"),
        this.loadGroupExpense(this.groupList[0]);
      }
    });
  }

  removeGroup(groupExpense: Group){
    this.loadGroupExpense(groupExpense);
    this.deleteGroupModal.show();
  }
 
  deleteGroup(){
    this.groupExpenseService.removeGroup(Number(this.group.id)).subscribe({
      next: res => console.log(res),
      error: err => this.errorMessage = err,
      complete: () => {
        this.getGroupExpenseList(),
        this.deleteGroupModal.hide();
      }
    });
  }

  editGroup(){
    this.groupExpenseForm.get('groupName')?.patchValue(this.group.name);
    this.groupExpenseForm.get('groupMembers')?.patchValue(this.group.members);
    this.groupMembersList = this.groupExpenseForm.get('groupMembers')?.value;

    this.editGroupModal.show();
  }

  updateGroup(){
    var groupExpense = {} as Group;
    groupExpense.name = this.groupExpenseForm.get('groupName')?.value;
    groupExpense.id = this.group.id;
    groupExpense.members = this.groupMembersList;
    this.groupExpenseService.editGroup(groupExpense).subscribe({
      next: res => console.log(res),
      error: err => this.errorMessage = err,
      complete: () => {
        this.getGroupExpenseList(),
        this.groupExpenseForm.reset();
      }
    });
    this.groupMembersList = [];
    this.editGroupModal.hide();
  }

  hideModal(modalId: string){
    switch(modalId) { 
      case "addGroupModal": { 
        this.addGroupModal.hide();
         break; 
      }
      case "deleteGroupModal": { 
        this.deleteGroupModal.hide();
         break; 
      }
      case "editGroupModal":{
        this.editGroupModal.hide();
        break;
      }
    }
  }

  showModal(modalId: string){
    switch(modalId) { 
      case "addGroupModal": { 
        this.addGroupModal.show();
        break; 
      }
      case "deleteGroupModal": { 
        this.deleteGroupModal.show();
        break; 
      }
      case "editGroupModal":{
        this.editGroupModal.show();
        break; 
      }
    }
  }

}
