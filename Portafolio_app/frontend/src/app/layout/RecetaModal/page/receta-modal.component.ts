  import { Component, Input, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { IonicModule, ModalController } from '@ionic/angular';
  import { PasosRecetasService } from 'src/app/core/services/pasos-recetas.service';
  import { PasosModalComponent } from 'src/app/layout/pasos-modal/page/pasos-modal.component';
  import { environment } from 'src/environments/environment';
  import {
    IngredienteNutri,
    RecetasadmService,
  } from 'src/app/core/services/recetasadm.service';

  import { Share } from '@capacitor/share';

  @Component({
    selector: 'app-receta-modal',
    templateUrl: './receta-modal.component.html',
    styleUrls: ['./receta-modal.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule]
  })
  export class RecetaModalComponent implements OnInit {
    @Input() receta: any;
    ingredientes: IngredienteNutri[] = [];

    constructor(
      private modalCtrl: ModalController,
      private pasosRecetasService: PasosRecetasService,
      private recetasService: RecetasadmService
    ) {}

    cerrarModal() {
      this.modalCtrl.dismiss();
    }

    ngOnInit() {
      console.log('🧾 Receta recibida en modal:', this.receta);
      this.recetasService
        .getNutricionalReceta(this.receta.id_recetas)
        .subscribe({
          next: (data) => {
            this.ingredientes = data.detalle_ingredientes;
          },
          error: (err) => {
            console.error('Error al cargar ingredientes:', err);
          },
        });
    }

    async compartirReceta() {
      const shareData = {
        title: this.receta?.nombre_receta,
        text: this.receta?.descripcion_receta,
        //url: `${environment.shareUrl}/receta-compartida/${this.receta.id_recetas}`
        url: `${environment.Url}/receta-compartida/${this.receta.id_recetas}`,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          console.log('✅ Receta compartida con éxito');
          console.log('✅ Receta compartida con éxito');
        } catch (error) {
          console.error('❌ Error al compartir receta:', error);
        }
      } else {
        try {
          await Share.share(shareData);
          console.log('✅ Receta compartida con éxito');
        } catch (error) {
          console.error('❌ Error al compartir receta:', error);
          alert('La función de compartir no está disponible en este navegador.');
        }
      }
    }

    async iniciarPasoAPaso() {
      const pasos = await this.pasosRecetasService
        .obtenerPasos(this.receta.id_recetas)
        .toPromise();

      const modal = await this.modalCtrl.create({
        component: PasosModalComponent,
        cssClass: 'modal-fullscreen',
        showBackdrop: true,
        componentProps: { pasos }
      });
      await modal.present();
    }

  }
