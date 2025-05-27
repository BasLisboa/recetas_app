import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrearRecetaModalComponent } from './pages/crear-receta-modal.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations:[CrearRecetaModalComponent],
  imports: [
    CommonModule,
    CrearRecetaModalComponent,
    IonicModule
  ],
  exports: [CrearRecetaModalComponent]
  
})
export class CrearRecetaModule { }
