
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisComponent } from './mis.component';  

const routes: Routes = [
  {
    path: '',  
    component: MisComponent  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class misRoutingModule {}
