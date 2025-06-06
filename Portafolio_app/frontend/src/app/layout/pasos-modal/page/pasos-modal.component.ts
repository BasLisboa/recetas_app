import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
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
  pasoActual = 0;

  constructor(private modalCtrl: ModalController) {}

  avanzarPaso() {
    if (this.pasoActual < this.pasos.length - 1) {
      this.pasoActual++;
    } else {
      this.cerrar();
    }
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
}
