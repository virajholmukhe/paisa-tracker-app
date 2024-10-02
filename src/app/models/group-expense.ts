/* tslint:disable */
/* eslint-disable */
import { Expense } from './expense';
export interface Group {
  expenseDTO: Array<Expense>;
  id: number;
  expenseId: Array<number>;
  admin: string;
  createdOn: string;
  members: Array<string>;
  name: string;
  amount: number;
  unsettledAmount: number;
  
}
