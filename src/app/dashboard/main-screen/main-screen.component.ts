import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Expense } from '../../models/expense';
import { initFlowbite } from 'flowbite';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-main-screen',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule ],
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.css'
})
export class MainScreenComponent implements OnInit {
  
  @Input()
  expenseList!: Array<Expense>;


  expenseChart!: ApexCharts;
  categoryCharts!: ApexCharts;

  constructor(

  ){ }
  
  ngOnInit(): void {
    initFlowbite();

    this.expenseChartRender(7);

    this.categoryCharts = new ApexCharts(document.getElementById('donut-chart'), this.getCategoryChartOptions());
    this.categoryCharts.render();
  }

  public getDaysList(days: number){
    var today = new Date();
    var dateList:any = [];
    for (let index = 1; index < (days+1); index++) {
      var priorDate = new Date(new Date().setDate(today.getDate() - index)).getDate();
      dateList.push(priorDate)
    }
    // console.log(dateList);
    return dateList;
  }

  public expenseChartRender(days: number){
    var dateList = this.getDaysList(days);
    var borrowList: any = [];
    var lendList: any = [];

    this.expenseList.forEach(function (value) {
      console.log(value.expenseCreated);
    });

    this.expenseChart = new ApexCharts(document.getElementById('main-chart'), this.getMainChartOptions(dateList, borrowList, lendList));
    this.expenseChart.render();
    
  }

  public getCategoryChartOptions() {
    return {
      series: [35.1, 23.5, 2.4, 5.4],
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
                label: "Unique visitors",
                fontFamily: "Inter, sans-serif",
                formatter: (value: string) => {
                  return "10,000" + "k"
                },
              },
              value: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: -20,
                formatter: (value: string) => {
                  return value + "k"
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
      labels: ["Direct", "Sponsor", "Affiliate", "Email marketing"],
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
            return value + "k"
          },
        },
      },
      xaxis: {
        labels: {
          formatter: (value: string) => {
            return value + "k"
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

  public getMainChartOptions(dateList:any[], borrowList:any[], lendList:any[],) {

    let mainChartColors = {
      borderColor: '',
      labelColor: '',
      opacityFrom: 0,
      opacityTo: 0,
    }
  
    if (document.documentElement.classList.contains('dark')) {
      mainChartColors = {
        borderColor: '#374151',
        labelColor: '#9CA3AF',
        opacityFrom: 0,
        opacityTo: 0.15,
      };
    } else {
      mainChartColors = {
        borderColor: '#F3F4F6',
        labelColor: '#6B7280',
        opacityFrom: 0.45,
        opacityTo: 0,
      }
    }
  
    return {
      chart: {
        height: 420,
        type: 'area',
        fontFamily: 'Inter, sans-serif',
        foreColor: mainChartColors.borderColor,
        toolbar: {
          show: false
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          enabled: true,
          opacityFrom: mainChartColors.opacityFrom,
          opacityTo: mainChartColors.opacityTo
        }
      },
      dataLabels: {
        enabled: false
      },
      tooltip: {
        style: {
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
        },
      },
      grid: {
        show: true,
        borderColor: mainChartColors.borderColor,
        strokeDashArray: 1,
        padding: {
          left: 35,
          bottom: 15
        }
      },
      series: [
        {
          name: 'Borrow',
          data: borrowList,
          color: '#1A56DB'
        },
        {
          name: 'Lend',
          data: lendList,
          color: '#FDBA8C'
        }
      ],
      markers: {
        size: 5,
        strokeColors: '#ffffff',
        hover: {
          size: undefined,
          sizeOffset: 3
        }
      },
      xaxis: {
        categories: dateList,
        labels: {
          style: {
            colors: [mainChartColors.labelColor],
            fontSize: '14px',
            fontWeight: 500,
          },
        },
        axisBorder: {
          color: mainChartColors.borderColor,
        },
        axisTicks: {
          color: mainChartColors.borderColor,
        },
        crosshairs: {
          show: true,
          position: 'back',
          stroke: {
            color: mainChartColors.borderColor,
            width: 1,
            dashArray: 10,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: [mainChartColors.labelColor],
            fontSize: '14px',
            fontWeight: 500,
          },
          formatter: (value: string) => {
            return value + " ₹";
          }
        },
      },
      legend: {
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'Inter, sans-serif',
        labels: {
          colors: [mainChartColors.labelColor]
        },
        itemMargin: {
          horizontal: 10
        }
      },
      responsive: [
        {
          breakpoint: 1024,
          options: {
            xaxis: {
              labels: {
                show: false
              }
            }
          }
        }
      ]
    };
  }



}
