import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GroupExpense } from '../models/group-expense';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Expense } from '../models/expense';

@Injectable({
  providedIn: 'root'
})
export class GroupExpenseService {

  API_BASE_URL: string = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  public createGroupExpense(groupExpense: GroupExpense): Observable<any> {
    return this.http.post(this.API_BASE_URL+'/group-expense/add-group', groupExpense, {responseType: 'text'}).
    pipe(
      tap((data)=> console.log('Data Fetched: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  public getGroupExpenses(): Observable<any> {
    return this.http.get<GroupExpense[]>(this.API_BASE_URL+'/group-expense/get-all-groups');
  }

  public removeExpense(expenseGroupId: number):Observable<any>{
    return this.http.delete(this.API_BASE_URL+'/group-expense/delete-Group/'+expenseGroupId, { responseType: 'text'}).
    pipe(
      tap((data)=> console.log('Data Fetched: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  private handleError(err: HttpErrorResponse): Observable<any>{
    let errMsg = '';
    if(err.error instanceof Error){
      console.log('An error occured: ', err.error.message);
      errMsg = err.error.message;
    }else{
      console.log(`Backend returned code ${err.error.substring(12).slice(0,-2)}`);
      errMsg = err.error.substring(12).slice(0, -2);
      console.log(errMsg);
    }
    return throwError(()=> errMsg);
  }
}
