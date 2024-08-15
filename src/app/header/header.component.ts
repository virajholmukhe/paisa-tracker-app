import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FlowbiteService } from '../services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { JwtUtils } from '../utils/jwtUtils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  title = 'paisa-tracker-app';
  isLoggedIn = false;
  username!: string;
  currentURL!: string;

  constructor(private tokenService:TokenService, private router:Router, private activatedRoute: ActivatedRoute, private flowbiteService: FlowbiteService) {
    
  }

 ngOnInit(): void {
  //  initFlowbite();
   if(this.tokenService.token){
     this.isLoggedIn = true;
     this.username = JwtUtils.getUsername();
   }
 }

 signOut(){
   this.tokenService.clearToken();
   this.isLoggedIn = false;
   this.router.navigate(['/signin']);
 }

}
