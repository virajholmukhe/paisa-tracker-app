/* tslint:disable */
/* eslint-disable */
export interface GroupExpense {
  id: number;
  groudId: number;
  name: string;
  owner: string;
  category: string;
  description: string;
  amount: number;
  unsettledAmount: number;
  paidBy: string;
  paidTo: Array<string>;
  isSettled: boolean;
  isRemoved: boolean;
  createdOn: string;
  modifiedOn: string;
  paidOn: string;
  settledMembers: Array<string>;
}
