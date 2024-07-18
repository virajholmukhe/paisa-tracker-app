import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { TokenService } from './services/token.service';
import { JwtUtils } from './utils/jwtUtils';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FlowbiteService } from './services/flowbite.service';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterModule, CommonModule, HeaderComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  
  title = 'paisa-tracker-app';
  isLoggedIn = false;
  username!: string;
  currentURL!: string;

  constructor(private tokenService:TokenService, private router:Router, private activatedRoute: ActivatedRoute, private flowbiteService: FlowbiteService) {
    
   }

  ngOnInit(): void {
    initFlowbite();
    if(this.tokenService.token){
      this.isLoggedIn = true;
      this.username = JwtUtils.getUsername();
    }
  }

  signOut(){
    this.tokenService.clearToken();
    // window.location.reload();
    this.router.navigate(['/signin']);
  }
}
