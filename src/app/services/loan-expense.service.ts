import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoanExpense } from '../models/loan-expense';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanExpenseService {

  API_BASE_URL: string = 'http://localhost:8000'

  constructor(
    private http: HttpClient
  ) { }

  addLoanExpense(loanExpense: LoanExpense): Observable<any> {
    return this.http.post(this.API_BASE_URL+'/loan-expense/add-loan-expense', loanExpense, {responseType: 'text'}).
    pipe(
      tap((data)=> console.log('Data Fetched: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getLoanExpenseList(): Observable<any>{
    return this.http.get(this.API_BASE_URL+'/loan-expense/get-all-loan-expenses').
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
