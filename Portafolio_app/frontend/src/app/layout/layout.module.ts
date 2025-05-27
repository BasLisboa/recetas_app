import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TabMenuComponent } from './tab-menu/page/tab-menu.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [TabMenuComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports: [TabMenuComponent]
})
export class LayoutModule {}
