import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-emi-expense',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emi-expense.component.html',
  styleUrl: './emi-expense.component.css'
})
export class EmiExpenseComponent implements OnInit{

  ngOnInit(): void {
  }

}
