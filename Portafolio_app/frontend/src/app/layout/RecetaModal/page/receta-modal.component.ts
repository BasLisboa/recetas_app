import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-receta-modal',
  templateUrl: './receta-modal.component.html',
  styleUrls: ['./receta-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class RecetaModalComponent implements OnInit {
  @Input() receta: any;

  constructor(private modalCtrl: ModalController) {}

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {}
}
