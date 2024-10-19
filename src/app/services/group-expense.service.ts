import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Group } from '../models/group';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { GroupExpense } from '../models/group-expense';

@Injectable({
  providedIn: 'root'
})
export class GroupExpenseService {

  API_BASE_URL: string = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  public getGroupList(): Observable<any> {
    return this.http.get<Group[]>(this.API_BASE_URL+'/group-expense/get-all-groups').
    pipe(
      tap((data)=> console.log('Data Fetched: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  public createGroup(group: Group): Observable<any> {
    return this.http.post(this.API_BASE_URL+'/group-expense/add-group', group, {responseType: 'text'}).
    pipe(
      tap((data)=> console.log('Data Fetched: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  public getGroup(groupId: number): Observable<Group> {
    return this.http.get<Group>(this.API_BASE_URL+'/group-expense/get-groupExpense/'+groupId).
    pipe(
      tap((data)=> console.log('Data Fetched: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  public editGroup(group: Group): Observable<any> {
    return this.http.put<Group>(this.API_BASE_URL+'/group-expense/edit-group', group).
    pipe(
      tap((data)=> console.log('Data Fetched: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  public removeGroup(groupId: number):Observable<any>{
    return this.http.delete(this.API_BASE_URL+'/group-expense/delete-Group/'+groupId, { responseType: 'text'}).
    pipe(
      tap((data)=> console.log('Data Fetched: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  addExpense(expense: GroupExpense, groupExpenseId:number): Observable<any> {
    return this.http.post(this.API_BASE_URL+'/group-expense/add-expense/'+groupExpenseId, expense, {responseType: 'text'}).
    pipe(
      tap((data)=> console.log('Data Fetched: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  removeExpense(groupExpenseId: number, expenseId: number){
    return this.http.delete(this.API_BASE_URL+'/group-expense/remove-expense/'+groupExpenseId+'/'+ expenseId, { responseType: "text"}).
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
