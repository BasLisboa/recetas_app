import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TabMenuComponent } from 'src/app/layout/tab-menu/page/tab-menu.component';
import { HttpClient } from '@angular/common/http';
import { MisRecetasService } from 'src/app/core/services/mis-recetas.service';
import { RecetaModalComponent } from 'src/app/layout/RecetaModal/page/receta-modal.component';
import { CrearRecetaModalComponent } from 'src/app/layout/crear-receta-modal/pages/crear-receta-modal.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalEditarRecetaComponent } from 'src/app/layout/editar-receta-modal/pages/editar-receta-modal.component';
import { trigger, transition, style, animate } from '@angular/animations';


interface Receta {
  id_recetas: string;
  nombre_receta: string;
  tiempo: string;
  descripcion: string;
  imagen_url?: string; 
  // Agrega más campos si existen
}

@Component({
  selector: 'app-mis',
  templateUrl: './mis.component.html',
  styleUrls: ['./mis.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TabMenuComponent,
    RecetaModalComponent,
    CrearRecetaModalComponent,
    ModalEditarRecetaComponent,
  ],
  animations: [
    trigger('cardAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(28px) scale(.96)' }),
        animate('400ms cubic-bezier(.26,.53,.74,1.48)', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class MisComponent implements OnInit {

  misRecetas: Receta[] = [];
  idUsuario: string = '';
  nom_rec: string = '';
  usuario: any = {};
  mostrarCampos: boolean = false;
  private currentModal: HTMLIonModalElement | null = null;

  constructor(
    private alertCtrl: AlertController,
    private http: HttpClient,
    private misRecetasService: MisRecetasService,
    private modalCtrl: ModalController,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.idUsuario = payload.id;

      this.misRecetasService.obtenerRecetas(this.idUsuario).subscribe({
        next: (data: Receta[]) => {
          this.misRecetas = data;
          console.log('✅ Recetas cargadas:', this.misRecetas);
        },
        error: (err) => console.error('❌ Error al cargar recetas:', err)

      });

    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
    }
  }

  async editarReceta(receta: Receta) {
    console.log('🛠 Editar receta:', receta);
    this.usuario = receta; // Establecemos receta actual para el modal
    await this.abrirModalEditar(receta);
  }

  async eliminarReceta(receta: Receta) {
    console.log('🛠 Elminar receta:', receta);
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar receta?',
      message: `¿Estás seguro de que deseas eliminar "${receta.nombre_receta}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.misRecetas = this.misRecetas.filter(r => r.id_recetas !== receta.id_recetas);
            this.misRecetasService.eliminarReceta(receta.id_recetas).subscribe({
              next: () => console.log('✅ Receta eliminada correctamente'),
              error: (err) => console.error('❌ Error al eliminar receta:', err)
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async verDetalles(receta: Receta) {
    console.log("🔍 Ver detalles de receta:", receta);
    await this.cerrarModalActual();

    try {
      this.currentModal = await this.modalCtrl.create({
        component: RecetaModalComponent,
        componentProps: { receta },
        cssClass: 'custom-modal',
        backdropDismiss: true,
        animated: true,
      });

      await this.currentModal.present();
      const { role } = await this.currentModal.onDidDismiss();
      console.log("🔵 Modal de detalles cerrado con rol:", role);
      this.currentModal = null;

    } catch (err) {
      console.error("❌ Error al abrir modal de detalles:", err);
    }
  }

  async agregarReceta() {
    console.log("➕ Agregar nueva receta");
    await this.cerrarModalActual();

    try {
      this.currentModal = await this.modalCtrl.create({
        component: CrearRecetaModalComponent,
        cssClass: 'custom-modal',
        backdropDismiss: true,
        animated: true,
      });

      await this.currentModal.present();
      const { role } = await this.currentModal.onDidDismiss();
      console.log("🔵 Modal de creación cerrado con rol:", role);
      this.currentModal = null;

    } catch (err) {
      console.error("❌ Error al crear modal:", err);
    }
  }

  async abrirModalEditar(receta: any) {
    const usuarioId = this.authService.getUserIdFromToken();
    console.log("✏️ Abrir modal de edición");

    await this.cerrarModalActual();

    try {
      this.currentModal = await this.modalCtrl.create({
        component: ModalEditarRecetaComponent,
        componentProps: { receta },
        cssClass: 'custom-modal',
        backdropDismiss: true,
        animated: true,
      });

      await this.currentModal.present();

      const { data, role } = await this.currentModal.onDidDismiss();
      console.log("🔵 Modal de edición cerrado con rol:", role);
      this.currentModal = null;

      if (data) {
        console.log("📥 Datos recibidos:", data);
        this.usuario = { ...this.usuario, ...data };
        this.mostrarCampos = true;

        this.misRecetasService.editarReceta(this.usuario).subscribe({
          next: () => console.log('✅ Receta actualizada correctamente'),
          error: (err) => console.error('❌ Error al actualizar receta:', err)
        });
      }

    } catch (error) {
      console.error("❌ Error al abrir modal de edición:", error);
    }
  }

  private async cerrarModalActual() {
    if (this.currentModal) {
      try {
        await this.currentModal.dismiss();
        this.currentModal = null;
      } catch (e) {
        console.warn("⚠️ Error al cerrar modal previo:", e);
      }
    }
  }
}
