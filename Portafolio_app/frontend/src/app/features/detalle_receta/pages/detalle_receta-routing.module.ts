import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleRecetaComponent } from './detalle_receta.component';

const routes: Routes = [
  { path: '', component: DetalleRecetaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetalleRecetaRoutingModule {}
