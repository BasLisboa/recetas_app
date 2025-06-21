import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { IonicModule } from '@ionic/angular';

import { PerfilRoutingModule } from './page/perfil-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilRoutingModule,
    NgChartsModule,
  ]
})
export class PerfilPageModule {}
