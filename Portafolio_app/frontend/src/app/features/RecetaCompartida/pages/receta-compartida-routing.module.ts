import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecetaCompartidaPage } from './receta-compartida.page';

const routes: Routes = [
  {
    path: ':id',
    component: RecetaCompartidaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecetaCompartidaPageRoutingModule {}
