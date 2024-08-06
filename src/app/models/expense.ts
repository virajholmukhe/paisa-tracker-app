/* tslint:disable */
/* eslint-disable */
export interface Expense {
  amount: number;
  description: string;
  expenseCategory: string;
  expenseId: number;
  expenseOwner: string;
  isRemoved: boolean;
  isSettled: boolean;
  paidBy: string;
  paidTo: Array<string>;
  unsettledAmountChange: Array<number>;
  unsettledAmount: number;
  expenseCreated: string;
}
