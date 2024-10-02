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
import { AuthenticationService } from './services/authentication.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterModule, CommonModule, HeaderComponent, HeaderComponent, FooterComponent, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  
  title = 'paisa-tracker-app';

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    initFlowbite();
    if (!this.authService.isAuthenticated()) {
      this.authService.logout(); // Auto logout if token is expired
    }
  }

}
