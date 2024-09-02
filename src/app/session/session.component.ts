import { CommonModule } from '@angular/common';
import { HttpClientXsrfModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthenticationRequest } from '../models/authentication-request';
import { AuthenticationService } from '../services/authentication.service';
import { TokenService } from '../services/token.service';
import { JwtUtils } from '../utils/jwtUtils';
import { RegistrationRequest } from '../models/registration-request';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterModule, CommonModule, FormsModule, ReactiveFormsModule, HttpClientXsrfModule, HeaderComponent],
  templateUrl: './session.component.html',
  styleUrl: './session.component.css'
})
export class SessionComponent implements OnInit{

  authRequest: AuthenticationRequest = {username: '', password: ''};
  errorMsg: String = "";
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  registrationRequest: RegistrationRequest = {username: '', fullname: '', email: '', password: ''};
  showRegister!: string;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private tokenService: TokenService
  ) { }
  
  ngOnInit(): void {
    initFlowbite();

    if(this.tokenService.token && !JwtUtils.isTokenExpired()){
      this.router.navigate(['/dashboard'])
    }else{
      localStorage.clear();
    }

    this.showRegister = this.route.snapshot.data['showRegister'] as string;
    this.errorMsg = '';
    this.loginForm = this.formBuilder.group({
      username:['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.-]*$')]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.formBuilder.group({
      username:['', [Validators.required]],
      fullname:['', [Validators.required]],
      email:['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login(){
    this.errorMsg = '';
    this.authRequest.username = this.loginForm.get('username')?.value;
    this.authRequest.password = this.loginForm.get('password')?.value;
    this.authService.authenticate(this.authRequest).subscribe({
      next: (result)=>{
        this.tokenService.token = result.token as string;
        window.location.reload();
      },
      error: (err)=>{
        this.errorMsg = err;
      },
      complete: ()=>{
        this.errorMsg = '';
      }
    });
  }

  register(){
    this.registrationRequest.username = this.registerForm.get('username')?.value;
    this.registrationRequest.fullname = this.registerForm.get('fullname')?.value;
    this.registrationRequest.email = this.registerForm.get('email')?.value;
    this.registrationRequest.password = this.registerForm.get('password')?.value;

    this.authService.register(this.registrationRequest).subscribe({
      next: ()=>{
        this.router.navigate(['/signin'])
      },
      error: (err)=>{
        this.errorMsg = err;
      },
      complete: ()=>{
        this.errorMsg = '';
      }
    });
  }
}
