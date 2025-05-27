
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecetaModalComponent } from '../page/receta-modal.component';  

const routes: Routes = [
  {
    path: '',  
    component: RecetaModalComponent  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModalRoutingModule {}
