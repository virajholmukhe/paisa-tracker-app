import { Component, OnInit, Output } from '@angular/core';
import { PersonalExpenseComponent } from "./personal-expense/personal-expense.component";
import { GroupExpenseComponent } from "./group-expense/group-expense.component";
import { Router, RouterOutlet } from '@angular/router';
import { TokenService } from '../services/token.service';
import { JwtUtils } from '../utils/jwtUtils';
import { initFlowbite, initModals } from 'flowbite';
import { EmiExpenseComponent } from "./emi-expense/emi-expense.component";
import { HotelExpenseComponent } from "./hotel-expense/hotel-expense.component";
import { FlowbiteService } from '../services/flowbite.service';
import { Expense } from '../models/expense';
import { PersonalExpenseServiceService } from '../services/personal-expense-service.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, PersonalExpenseComponent, GroupExpenseComponent, EmiExpenseComponent, HotelExpenseComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {
  isTokenValid = false;
  isDashboard: boolean = false;

  expenseList!: Array<Expense>;

  errorMessage: string = '';

  constructor(private tokenService: TokenService, private router:Router, private flowbiteService: FlowbiteService, private personalExpenseService: PersonalExpenseServiceService) { }

  ngOnInit(): void {
    initFlowbite();
    // this.getExpenseList();
    console.log("Loaded");
    if(!this.tokenService.token || JwtUtils.isTokenExpired()){
      this.router.navigate(['/signin']);
    }
    this.isDashboard = true;
    
  }

  getExpenseList(){
    this.personalExpenseService.getExpenseList().subscribe({
      next: expenseList => this.expenseList = expenseList,
      error: err => this.errorMessage = err
    });
  }

}
