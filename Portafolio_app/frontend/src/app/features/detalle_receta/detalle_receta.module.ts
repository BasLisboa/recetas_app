// src/app/features/detalle_receta/detalle_receta.module.ts

import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { IonicModule }        from '@ionic/angular';
import { FormsModule }        from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DetalleRecetaRoutingModule } from './pages/detalle_receta-routing.module';

// Componentes standalone
import { DetalleRecetaComponent }     from './pages/detalle_receta.component';
import { TabMenuComponent }           from 'src/app/layout/tab-menu/page/tab-menu.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    DetalleRecetaRoutingModule,
    RouterModule,
    // IMPORTA los standalone components (no van en declarations)
    DetalleRecetaComponent,
    TabMenuComponent
  ],

})
export class DetalleRecetaModule {}
