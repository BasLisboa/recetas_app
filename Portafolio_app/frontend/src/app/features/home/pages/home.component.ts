import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { RecetasadmService, RecetaAdm } from 'src/app/core/services/recetasadm.service';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TabMenuComponent } from 'src/app/layout/tab-menu/page/tab-menu.component';
import { ChatbotComponent } from 'src/app/layout/chatbot/pages/chatbot.component';
import { RecetaModalComponent } from 'src/app/layout/RecetaModal/page/receta-modal.component';

// Animaciones
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { MisRecetasService } from 'src/app/core/services/mis-recetas.service';

interface Receta {
  id_recetas: string;
  nombre_receta: string;
  tiempo: string;
  descripcion: string;
  imagen_url?: string; 
  // Agrega más campos si existen
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabMenuComponent,
    RouterModule,
    ChatbotComponent,
    RecetaModalComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('cardAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(34px) scale(0.96)' }),
        animate('400ms cubic-bezier(.26,.53,.74,1.48)',
          style({ opacity: 1, transform: 'none' })
        )
      ])
    ])
  ]
})

export class HomeComponent implements OnInit, OnDestroy {
  showChat = false;
  textoBusqueda = '';
  recetas: Receta[] = [];
  busquedaActiva = false;
  private routerSub!: Subscription;
  tipoBusqueda: 'ingrediente' | 'nombre' = 'ingrediente';
  private currentModal: HTMLIonModalElement | null = null;
  idUsuario: string = '';

  //Carousel Hero
  carouselItems = [
    { image: 'assets/carousel/slide1.jpg', title: '¡Bienvenido a Cookwell!', subtitle: 'Recetas saludables, fáciles y rápidas' },
    { image: 'assets/carousel/slide2.jpg', title: 'Descubre y comparte', subtitle: 'Comparte tus mejores recetas con la comunidad' },
    { image: 'assets/carousel/slide3.jpg', title: 'Come sano', subtitle: 'Aprovecha lo que tienes a mano' },
  ];
  carouselIndex = 0;
  carouselInterval: any;

  constructor(
    private recetasService: RecetasadmService,
    private router: Router,
    private modalCtrl: ModalController,
    private misRecetasService: MisRecetasService,
  ) {
    this.routerSub = this.router.events
      .pipe(filter(evento => evento instanceof NavigationEnd))
      .subscribe(() => {
        this.loadDefault();
      });
  }

  ngOnInit(): void {
    this.loadDefault();
    this.routerSub = this.router.events.pipe(
      filter(evt => evt instanceof NavigationEnd && (evt as NavigationEnd).urlAfterRedirects === '/home')
    ).subscribe(() => {
      this.loadDefault();
    });

        const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.idUsuario = payload.id;

      this.misRecetasService.obtenerRecetas(this.idUsuario).subscribe({
        next: (data: Receta[]) => {
          this.recetas = data;
          console.log('✅ Recetas cargadas:', this.recetas);
        },
        error: (err) => console.error('❌ Error al cargar recetas:', err)

      });

    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
    }
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }

  toggleChat() { this.showChat = !this.showChat; }
  
  minimizarChat() { this.showChat = false; }

  loadDefault(): void {
    this.busquedaActiva = false;
    this.textoBusqueda = '';
    this.recetasService.listarDefault()
      .subscribe(list => this.recetas = list);
  }

  reset(): void { this.loadDefault(); }
  onInput(event: any): void {
    this.textoBusqueda = (event.target.value || '').trim();
  }

  buscarRecetas(): void {
    if (!this.textoBusqueda) return;
    this.busquedaActiva = true;
    const obs = this.tipoBusqueda === 'ingrediente'
      ? this.recetasService.buscarPorIngrediente(this.textoBusqueda)
      : this.recetasService.buscarPorNombre(this.textoBusqueda);
    obs.subscribe(list => this.recetas = list);
  }

  goToSlide(index: number) {
    this.carouselIndex = index;
  }

  async verDetalles(receta: any) {
    console.log("🔍 Ver detalles de receta (previa):", receta);
    await this.cerrarModalActual();
    
    try {
      const id = receta.id_recetas || receta.id; // por si viene con nombre distinto
      const recetaCompleta = await this.recetasService
        .obtenerRecetaPorId(id)
        .toPromise();
    
      console.log("🧾 Receta completa:", recetaCompleta);
    
      this.currentModal = await this.modalCtrl.create({
        component: RecetaModalComponent,
        componentProps: { receta: recetaCompleta },
        cssClass: 'custom-modal',
        backdropDismiss: true,
        animated: true,
      });
    
      await this.currentModal.present();
    
      const { role } = await this.currentModal.onDidDismiss();
      console.log("🔵 Modal de detalles cerrado con rol:", role);
      this.currentModal = null;
    
    } catch (err) {
      console.error("❌ Error al abrir modal con receta completa:", err);
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
