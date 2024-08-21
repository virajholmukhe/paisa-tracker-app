/* tslint:disable */
/* eslint-disable */
export interface Expense {
  id: number;
  name: string;
  owner: string;
  category: string;
  description: string;
  amount: number;
  unsettledAmount: number;
  unsettledAmountChange: Array<number>;
  paidBy: string;
  paidTo: Array<string>;
  isSettled: boolean;
  isRemoved: boolean;
  createdOn: string;
  paidOn: string;
  expenseShare: number;
}
