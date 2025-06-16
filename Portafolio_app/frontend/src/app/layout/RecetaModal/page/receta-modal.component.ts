import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { PasosRecetasService } from 'src/app/core/services/pasos-recetas.service';
import { PasosModalComponent } from 'src/app/layout/pasos-modal/page/pasos-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-receta-modal',
  templateUrl: './receta-modal.component.html',
  styleUrls: ['./receta-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class RecetaModalComponent implements OnInit {
  @Input() receta: any;

  constructor(private modalCtrl: ModalController,  private pasosRecetasService: PasosRecetasService) {}

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  ngOnInit() {
    console.log('🧾 Receta recibida en modal:', this.receta);
  }

  compartirReceta() {
    if (navigator.share) {
      navigator.share({
      title: this.receta?.nombre_receta,
      text: this.receta?.descripcion_receta,
      url: `${environment.Url}/receta-compartida/${this.receta.id_recetas}`
      }).then(() => {
        console.log('✅ Receta compartida con éxito');
     }).catch((error) => {
        console.error('❌ Error al compartir receta:', error);
      });
    } else {
      alert('La función de compartir no está disponible en este navegador.');
    }
  }

  async iniciarPasoAPaso() {
    const pasos = await this.pasosRecetasService
      .obtenerPasos(this.receta.id_recetas)
      .toPromise();

    const modal = await this.modalCtrl.create({
      component: PasosModalComponent,
      componentProps: { pasos }
    });
    await modal.present();
  }

}
