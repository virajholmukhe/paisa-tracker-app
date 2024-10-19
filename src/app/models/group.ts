/* tslint:disable */
/* eslint-disable */
import { GroupExpense } from './group-expense';
export interface Group {
  id: number;
  expenseIds: Array<number>;
  expenseDTO: Array<GroupExpense>;
  name: string;
  admin: string;
  members: Array<string>;
  createdOn: string;
  amount: number;
  unsettledAmount: number;
}
