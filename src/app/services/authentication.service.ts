import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationRequest } from '../models/authentication-request';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { RegistrationRequest } from '../models/registration-request';
import { JwtUtils } from '../utils/jwtUtils';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  API_BASE_URL: string = 'http://localhost:8000';

  constructor(
    private http: HttpClient,
    private router: Router  
  ) { }

  authenticate(body: AuthenticationRequest): Observable<any> {
    return this.http.post(this.API_BASE_URL+'/auth/authenticate', body)
    .pipe(
      // tap((data)=> console.log('Data Fetched: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  register(body: RegistrationRequest): Observable<any> {
    return this.http.post(this.API_BASE_URL+'/auth/register', body)
    .pipe(
      // tap((data)=> console.log('Data Fetched: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (!token) {
      return false;
    }

    // Check if token is expired
    const isExpired = JwtUtils.isTokenExpired();
    if (isExpired) {
      return false;
    }
    return true;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }

  isTokenValid(username: string): Observable<any>{
    return this.http.get(this.API_BASE_URL+'/auth/validate/'+username)
    .pipe(
      catchError(this.handleError)
    )
  }

  validateUsername(username: string): Observable<any>{
    return this.http.get(this.API_BASE_URL + '/validate-username/'+username)
    .pipe(
      catchError(this.handleError)
    )
  }

  private handleError(err: HttpErrorResponse): Observable<any>{
    let errMsg = '';
    if(err.error instanceof Error){
      // console.log('An error occured: ', err.error.message);
      errMsg = err.error.message;
    }else{
      // console.log(err.error.message);
      // console.log(`Backend returned code ${err.error.substring(12).slice(0,-2)}`);
      errMsg = err.error.message;
      // console.log(errMsg);
    }
    return throwError(()=> errMsg);
  }
}
