import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { initFlowbite, Modal, ModalInterface } from 'flowbite';
import { LoanExpense } from '../../models/loan-expense';
import { JwtUtils } from '../../utils/jwtUtils';
import { LoanExpenseService } from '../../services/loan-expense.service';

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
  loanExpense: LoanExpense = {} as LoanExpense;

  @Input()
  loanExpenseList!: Array<LoanExpense>;

  @Output()
  loanExpenseListChange = new EventEmitter<Array<LoanExpense>>();

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private loanExpenseService: LoanExpenseService
  ){ }

  ngOnInit(): void {
    initFlowbite();
    this.getLoanExpenseList();
    this.loanForm = this.formBuilder.group({
      lenderName:['', [Validators.required, Validators.pattern("^[a-zA-Z\\s]*$")]],
      amount: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      tenure: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      category: ['', [Validators.required]],
      processingFee: ['', [Validators.required, Validators.pattern("^[0-9]+$")]],
      interestRate: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.max(100)]],
      loanDisbursedDate: ['', [Validators.required]],
      emiStartDate: ['', [Validators.required, Validators.pattern("^[0-9]+$"), Validators.max(31), Validators.min(1)]],
      
    });

    const $modalElement1: HTMLElement = document.querySelector('#addLoanModal') as HTMLElement;
    this.addLoanModal = new Modal($modalElement1, {}, {});
    // const $modalElement2: HTMLElement = document.querySelector('#settleupModal') as HTMLElement;
    // this.settleupModal = new Modal($modalElement2, {}, {});
    // const $modalElement3: HTMLElement = document.querySelector('#viewModal') as HTMLElement;
    // this.viewModal = new Modal($modalElement3, {}, {});

  }

  addLoan(){
    var loanExpense = {} as LoanExpense;
    loanExpense.lenderName = this.loanForm.get('lenderName')?.value;
    loanExpense.loanAmount = this.loanForm.get('amount')?.value;
    loanExpense.loanOwner = JwtUtils.getUsername() as string;
    loanExpense.category = this.loanForm.get('category')?.value;
    loanExpense.tenure = this.loanForm.get('tenure')?.value;
    loanExpense.processingFee = this.loanForm.get('processingFee')?.value;
    loanExpense.interestRate = this.loanForm.get('interestRate')?.value;
    loanExpense.loanDisbursedDate = this.loanForm.get('loanDisbursedDate')?.value;
    loanExpense.emiStartDate = this.loanForm.get('emiStartDate')?.value;

    this.loanExpenseService.addLoanExpense(loanExpense).subscribe({
      next: res => console.log(res),
      error: err => this.errorMessage = err,
      complete: () => {
        this.getLoanExpenseList(),
        this.loanForm.reset();
      }
    });
    this.addLoanModal.hide();
  }

  getLoanExpenseList(){
    console.log("getLoanExpenseList() method called");
    this.loanExpenseService.getLoanExpenseList().subscribe({
      next: res => this.loanExpenseList = res,
      error: err => this.errorMessage = err,
      complete: () => {
        console.log("Call is completed"),
        this.loanExpenseListChange.emit(this.loanExpenseList);
      }
    });
  }

  loadLoanExpense(loan: LoanExpense){
    this.loanExpense = loan;
  }

  deleteLoan(id: number){
    
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
