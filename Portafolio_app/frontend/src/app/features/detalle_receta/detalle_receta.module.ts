import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DetalleRecetaComponent } from './pages/detalle_receta.component';
import { DetalleRecetaRoutingModule } from './pages/detalle_receta-routing.module';
import { TabMenuComponent } from 'src/app/layout/tab-menu/page/tab-menu.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    DetalleRecetaRoutingModule
  ],
  declarations: [
    DetalleRecetaComponent,
    TabMenuComponent   // si no usas standalone
  ]
})
export class DetalleRecetaModule {}
