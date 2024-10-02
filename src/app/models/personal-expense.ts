/* tslint:disable */
/* eslint-disable */
export interface PersonalExpense {
  id: number;
  name: string;
  owner: string;
  category: string;
  description: string;
  amount: number;
  unsettledAmount: number;
  unsettledAmountChange: Array<number>;
  paidBy: string;
  paidTo: string;
  isSettled: boolean;
  createdOn: string;
}
