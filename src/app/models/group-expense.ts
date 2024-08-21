/* tslint:disable */
/* eslint-disable */
import { Expense } from './expense';
export interface GroupExpense {
  expenseDTO: Array<Expense>;
  groupId: number;
  expenseId: Array<number>;
  groupAdmin: string;
  groupCreated: string;
  groupMembers: Array<string>;
  groupName: string;
  totalAmount: number;
  totalUnpaidAmount: number;
  
}
