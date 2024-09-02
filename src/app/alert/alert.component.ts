import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { Modal, ModalInterface } from 'flowbite';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterModule, CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnInit{


  alert!: ModalInterface;

  constructor (

  ){}

  ngOnInit(): void {
    const $modalElement: HTMLElement = document.querySelector('#alert') as HTMLElement;
    this.alert = new Modal($modalElement, {}, {});
  }

  hideModal(modalId: string){
    switch(modalId) { 
      case "alert": { 
        this.alert.hide();
         break; 
      }
    }
  }
  
  showModal(modalId: string){
    switch(modalId) {
      case "alert": { 
        this.alert.show();
        break; 
      }
    }
  }



}
