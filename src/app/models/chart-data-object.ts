/* tslint:disable */
/* eslint-disable */
export interface ChartDataObject {
  total: number;
  totalBorrow: number;
  totalLend: number;
  totalOthers: number;
  
  expenseCategory: string;
  expenseId: number;
  expenseOwner: string;
  isRemoved: boolean;
  isSettled: boolean;
  paidBy: string;
  paidTo: Array<string>;
  unsettledAmount: number;
  expenseCreated: string;
}
