import { Component, OnInit, Output } from '@angular/core';
import { PersonalExpenseComponent } from "./personal-expense/personal-expense.component";
import { GroupExpenseComponent } from "./group-expense/group-expense.component";
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TokenService } from '../services/token.service';
import { JwtUtils } from '../utils/jwtUtils';
import { initFlowbite, initModals } from 'flowbite';
import { EmiExpenseComponent } from "./emi-expense/emi-expense.component";
import { FlowbiteService } from '../services/flowbite.service';
import { Expense } from '../models/expense';
import { PersonalExpenseServiceService } from '../services/personal-expense-service.service';
import { CommonModule } from '@angular/common';
import { MainScreenComponent } from "./main-screen/main-screen.component";
import { LoanExpense } from '../models/loan-expense';
import { ProfileComponent } from "../profile/profile.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, PersonalExpenseComponent, GroupExpenseComponent, EmiExpenseComponent, CommonModule, MainScreenComponent, ProfileComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  isLoggedIn = false;
  username!: string;
  isTokenValid = false;
  expenseList: Array<Expense> = new Array<Expense>();
  loanExpenseList: Array<LoanExpense> = new Array<LoanExpense>();
  errorMessage: string = '';
  

  constructor(
    private tokenService: TokenService,
    private router:Router,
    private personalExpenseService: PersonalExpenseServiceService
  ) {}

  ngOnInit(): void {
    initFlowbite();
    this.getExpenseList();
    this.getCategoryChartData();
    console.log("Loaded");
    if(!this.tokenService.token || JwtUtils.isTokenExpired()){
      this.router.navigate(['/signin']);
    }
    if(this.tokenService.token){
      this.isLoggedIn = true;
      this.username = JwtUtils.getUsername();
    }
  }

  getExpenseList(){
    console.log("getExpenseList() method called");
    this.personalExpenseService.getExpenseList().subscribe({
      next: res => this.expenseList = res,
      error: err => this.errorMessage = err,
      complete: () => console.log("Call is completed")
    });
  }

  getCategoryChartData(){
    this.personalExpenseService.getCategoryChartData().subscribe({
      next: res => console.log(res),
      error: err => this.errorMessage = err,
      complete: () => console.log("Call is completed")
    });
  }

  signOut(){
    this.tokenService.clearToken();
    this.router.navigate(['/home']);
  }
}
