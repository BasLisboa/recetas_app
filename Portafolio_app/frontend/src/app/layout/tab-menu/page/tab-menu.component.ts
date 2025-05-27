import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-menu',
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,    
    IonicModule       
  ]
})
export class TabMenuComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {}

  IrMenu(){
    this.router.navigate(['home']);
  }

  IrMis(){
    this.router.navigate(['mis']);
  }

  IrPerfil(){
    this.router.navigate(['perfil']);
  }
}
