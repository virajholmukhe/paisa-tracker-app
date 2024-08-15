import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Expense } from '../../models/expense';
import { initFlowbite } from 'flowbite';
import ApexCharts from 'apexcharts';
import { PersonalExpenseServiceService } from '../../services/personal-expense-service.service';
import { ChartData } from '../../models/chart-data';

@Component({
  selector: 'app-main-screen',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule ],
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.css'
})
export class MainScreenComponent implements OnInit {
  
  expenseList: Array<Expense> = {} as Array<Expense>;

  expenseChart!: ApexCharts;
  categoryCharts!: ApexCharts;
  errorMessage = '';
  chartData: ChartData = {} as ChartData;

  constructor(
    private personalExpenseService: PersonalExpenseServiceService,
  ){ }
  
  ngOnInit(): void {
    initFlowbite();
    this.getPersonalExpenseList();
  }

  getPersonalExpenseList(){
    console.log("getExpenseList() method called");
    this.personalExpenseService.getExpenseList().subscribe({
      next: res => this.expenseList = res,
      error: err => this.errorMessage = err,
      complete: () => {
        this.getCategoryChartData();
      }
    });
  }

  getCategoryChartData(){
    this.personalExpenseService.getCategoryChartData().subscribe({
      next: res => this.chartData = res,
      error: err => this.errorMessage = err,
      complete: () => this.expenseChartRender(7)
    });
  }

  public expenseChartRender(days: number){
    this.expenseChart = new ApexCharts(document.getElementById('bar-chart'), this.getMainChartOptions());
    this.expenseChart.render();
    this.categoryCharts = new ApexCharts(document.getElementById('donut-chart'), this.getCategoryChartOptions());
    this.categoryCharts.render();
  }

  public getMonths(){
    const date = new Date();  // 2009-11-10
    const month1 = date.toLocaleString('default', { month: 'short' });
    date.setMonth(date.getMonth() - 1);
    const month2 = date.toLocaleString('default', { month: 'short' });
    date.setMonth(date.getMonth() - 1);
    const month3 = date.toLocaleString('default', { month: 'short' });
    return [month1, month2, month3]
  }

  public getCategoryChartOptions() {
    return {
      series: [this.chartData.lend, this.chartData.food, this.chartData.shopping, this.chartData.bill, this.chartData.fuel],
      colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694"],
      chart: {
        height: 320,
        width: "100%",
        type: "donut",
      },
      stroke: {
        colors: ["transparent"],
        lineCap: "",
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: 20,
              },
              total: {
                showAlways: true,
                show: true,
                label: "Total Spent",
                fontFamily: "Inter, sans-serif",
                formatter: (w: any) => {
                  const sum = w.globals.seriesTotals.reduce((a:any, b:any) => {
                    return a + b
                  }, 0)

                  return '' + sum + '₹'
                },
              },
              value: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: -20,
                formatter: (value: string) => {
                  return value + "₹"
                },
              },
            },
            size: "80%",
          },
        },
      },
      grid: {
        padding: {
          top: -2,
        },
      },
      labels: ["Lend", "Food", "Shopping", "Bill", "Fuel"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
      yaxis: {
        labels: {
          formatter: (value: string) => {
            return value + "₹"
          },
        },
      },
      xaxis: {
        labels: {
          formatter: (value: string) => {
            return value + "₹"
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
    }
  }

  public getMainChartOptions() {
    return {
      series: [
        {
          name: "Borrow",
          color: "#31C48D",
          data: [this.chartData.borrow, 0, 0],
        },
        {
          name: "Lend",
          data: [this.chartData.lend, 0, 0],
          color: "#F05252",
        }
      ],
      chart: {
        sparkline: {
          enabled: false,
        },
        type: "bar",
        width: "100%",
        height: 400,
        toolbar: {
          show: false,
        }
      },
      fill: {
        opacity: 1,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: "100%",
          borderRadiusApplication: "end",
          borderRadius: 6,
          dataLabels: {
            position: "top",
          },
        },
      },
      legend: {
        show: true,
        position: "bottom",
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        intersect: false,
        formatter: (value: string) => {
          return value + "k"
        },
      },
      xaxis: {
        labels: {
          show: true,
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
          },
          formatter: (value: string) => {
            return value + "k"
          },
        },
        categories: this.getMonths(),
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: true,
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
          }
        }
      },
      grid: {
        show: true,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: -20
        },
      }
    };
  }



}
