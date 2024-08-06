import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { initFlowbite, Modal, ModalInterface } from 'flowbite';

@Component({
  selector: 'app-emi-expense',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './emi-expense.component.html',
  styleUrl: './emi-expense.component.css'
})
export class EmiExpenseComponent implements OnInit{

  addLoanModal!: ModalInterface;
  // settleupModal!: ModalInterface;
  // viewModal!: ModalInterface;

  errorMessage = '';

  loanForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router
  ){ }

  ngOnInit(): void {
    initFlowbite();
    this.loanForm = this.formBuilder.group({
      name:['', [Validators.required, Validators.pattern("^[a-zA-Z\\s]*$")]],
      amount: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      tenure: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      category: ['', [Validators.required]]
    });

    const $modalElement1: HTMLElement = document.querySelector('#addLoanModal') as HTMLElement;
    this.addLoanModal = new Modal($modalElement1, {}, {});
    // const $modalElement2: HTMLElement = document.querySelector('#settleupModal') as HTMLElement;
    // this.settleupModal = new Modal($modalElement2, {}, {});
    // const $modalElement3: HTMLElement = document.querySelector('#viewModal') as HTMLElement;
    // this.viewModal = new Modal($modalElement3, {}, {});

  }

  addLoan(){

  }

  hideModal(modalId: string){
    switch(modalId) { 
      case "addLoanModal": { 
        this.addLoanModal.hide();
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
      case "addLoanModal": { 
        this.addLoanModal.show();
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
