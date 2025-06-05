import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecetaCompartidaPageRoutingModule } from 'src/app/features/RecetaCompartida/pages/receta-compartida-routing.module';

import { RecetaCompartidaPage } from './receta-compartida.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecetaCompartidaPage,
    RecetaCompartidaPageRoutingModule
  ],
})
export class RecetaCompartidaPageModule {}
