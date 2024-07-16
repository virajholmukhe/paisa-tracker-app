import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from '../models/expense';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalExpenseServiceService {

  API_BASE_URL: string = 'http://localhost:8000'

  constructor(private http: HttpClient) { }

  addExpense(expense: Expense): Observable<any> {
    return this.http.post(this.API_BASE_URL+'/expense/add-expense', expense, {responseType: 'text'}).
    pipe(
      tap((data)=> console.log('Data Fetched: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  // getExpenseList():Observable<any>{
  //   return this.http.get(this.API_BASE_URL+'/expense/get-all-expenses')
  //   .pipe(
  //     tap((data)=> console.log('Data Fetched: ' + JSON.stringify(data))),
  //     catchError(this.handleError)
  //   );
  // }

  getExpenseList():Observable<Expense[]>{
    return this.http.get<Expense[]>(this.API_BASE_URL+'/expense/get-all-expenses')
    .pipe(
      tap((data)=> console.log('Data Fetched: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getExpense(expenseId: number): Observable<any>{
    return this.http.get(this.API_BASE_URL+'/expense/get-expense/'+expenseId).
    pipe(
      tap((data)=> console.log('Data Fetched: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  settleUpExpense(expenseId: number, settledAmount: number):Observable<any>{
    return this.http.get(this.API_BASE_URL+'/expense/settle-expense/'+expenseId+"?settledAmount="+settledAmount, {responseType: 'text'}).
    pipe(
      tap((data)=> console.log('Data Fetched: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  removeExpense(expenseId: number):Observable<any>{
    return this.http.delete(this.API_BASE_URL+'/expense/remove-expense/'+expenseId).
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
