import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { PasoReceta } from 'src/app/core/services/pasos-recetas.service';

@Component({
  selector: 'app-pasos-modal',
  templateUrl: './pasos-modal.component.html',
  styleUrls: ['./pasos-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class PasosModalComponent {
  @Input() pasos: PasoReceta[] = [];
  currentIndex = 0;

  constructor(private modalCtrl: ModalController) {}

  avanzar() {
    if (this.currentIndex < this.pasos.length - 1) {
      this.currentIndex++;
    } else {
      this.modalCtrl.dismiss();
    }
  }
}
