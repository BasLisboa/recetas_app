
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabMenuComponent } from '../page/tab-menu.component';  

const routes: Routes = [
  {
    path: '',  
    component: TabMenuComponent  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabRoutingModule {}
