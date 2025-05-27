import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalPerfilComponent } from '../modal-perfil/pages/modal-perfil.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalPerfilComponent
  ]
})
export class PerfilPageModule {}
