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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, PersonalExpenseComponent, GroupExpenseComponent, EmiExpenseComponent, CommonModule, MainScreenComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  isTokenValid = false;
  expenseList: Array<Expense> = new Array<Expense>();
  errorMessage: string = '';

  constructor(
    private tokenService: TokenService,
    private router:Router,
    private personalExpenseService: PersonalExpenseServiceService
  ) {}

  ngOnInit(): void {
    initFlowbite();
    this.getExpenseList();
    console.log("Loaded");
    if(!this.tokenService.token || JwtUtils.isTokenExpired()){
      this.router.navigate(['/signin']);
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
}
