
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModalPerfilComponent } from './modal-perfil.component';  

const routes: Routes = [
  {
    path: '',  
    component: ModalPerfilComponent  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModalPerfilRoutingModule {}
