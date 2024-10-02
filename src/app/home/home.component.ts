import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { HeaderComponent } from "../header/header.component";
import { TokenService } from '../services/token.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JwtUtils } from '../utils/jwtUtils';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  
  isLoggedIn = false;
  username!: string;
  currentURL!: string;

  constructor(
    private tokenService:TokenService,
    private router:Router,
    private activatedRoute: ActivatedRoute
  ){}

  ngOnInit(): void {
    initFlowbite();
    if(this.tokenService.token){
      this.isLoggedIn = true;
      this.username = JwtUtils.getUsername();
    }
  }

  signOut(){
    this.tokenService.clearToken();
    this.router.navigate(['/signin']);
  }
  
}
