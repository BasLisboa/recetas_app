  import { Component, Input, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { IonicModule, ModalController, ToastController } from '@ionic/angular';
  import { PasosRecetasService } from 'src/app/core/services/pasos-recetas.service';
  import { PasosModalComponent } from 'src/app/layout/pasos-modal/page/pasos-modal.component';
  import { environment } from 'src/environments/environment';
  import {
    IngredienteNutri,
    NutricionalReceta,
    RecetasadmService,
  } from 'src/app/core/services/recetasadm.service';
  import { Share } from '@capacitor/share';
  import { FavoritosService } from 'src/app/core/services/favoritos.service';
  import { AuthService } from 'src/app/core/services/auth.service';
  

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
    nutricional!: NutricionalReceta;
    muestraNutri = false;
    loggedUserId: number | null = null;
    mostrarAgregar = true;
    constructor(
      private modalCtrl: ModalController,
      private pasosRecetasService: PasosRecetasService,
      private recetasService: RecetasadmService,
      private favoritosService: FavoritosService,
      private toastController: ToastController,
      private authService: AuthService,
    ) {}

    cerrarModal() {
      this.modalCtrl.dismiss();
    }

    ngOnInit() {
      console.log('🧾 Receta recibida en modal:', this.receta);

      this.loggedUserId = this.authService.getUserIdFromToken();
      if (this.receta?.id_usuario_creador === this.loggedUserId) {
        this.mostrarAgregar = false;
      }
        
      if (this.receta?.id_recetas) {
        this.recetasService
          .getNutricionalReceta(this.receta.id_recetas)
          .subscribe({
            next: (res) => {
              this.nutricional = res;
              this.muestraNutri = true;
            },
            error: (err) => {
              console.error('Error cargando datos nutricionales:', err);
              this.muestraNutri = false;
            },
          });
      }
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

    agregarFavorito() {
      const userId = this.authService.getUserIdFromToken();
        
      if (!userId || !this.receta?.id_recetas) {
        console.warn('⚠️ No se puede agregar a favoritos: datos faltantes.');
        return;
      }
    
      this.favoritosService.agregarFavorito(userId, this.receta.id_recetas).subscribe({
        next: async () => {
          const toast = await this.toastController.create({
            message: '✅ Receta agregada a tus recetas',
            duration: 2000,
            color: 'success',
            position: 'top'
          });
          toast.present();
        },
        error: async (err) => {
          if (err.status === 409) {
            const toast = await this.toastController.create({
              message: '⚠️ Esta receta ya estaba en tus recetas',
              duration: 2000,
              color: 'warning',
              position: 'top'
            });
            toast.present();
          } else {
            const toast = await this.toastController.create({
              message: '❌ Error al agregar a favoritos',
              duration: 2000,
              color: 'danger',
              position: 'top'
            });
            toast.present();
            console.error('❌ Error al agregar favorito:', err);
          }
        }
      });
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
