// home.component.ts
// Importaciones de Angular, ciclos de vida y módulos necesarios
import { Component, OnInit, OnDestroy } from '@angular/core'; // Component decorator y hooks de ciclo de vida
import { Router, NavigationEnd, RouterModule } from '@angular/router'; // Router para navegación, eventos de fin de navegación y módulo de rutas
import { filter, Subscription } from 'rxjs'; // filter para filtrar eventos de router y Subscription para gestionar suscripciones
import { RecetasadmService, RecetaAdm } from 'src/app/core/services/recetasadm.service'; // Servicio para obtener datos de recetas
import { FormsModule } from '@angular/forms'; // FormsModule para ngModel en formularios
import { IonicModule } from '@ionic/angular'; // Módulos de Ionic para componentes UI
import { CommonModule } from '@angular/common'; // Directivas comunes (ngIf, ngFor)
import { TabMenuComponent } from 'src/app/layout/tab-menu/page/tab-menu.component'; // Componente de menú de pestañas
import { ChatbotComponent } from 'src/app/layout/chatbot/pages/chatbot.component';


@Component({
  selector: 'app-home', // Etiqueta HTML para usar el componente
  standalone: true, // Componente independiente sin NgModule específico
  imports: [ // Módulos y componentes necesarios en la plantilla
    CommonModule,
    FormsModule,
    IonicModule,
    TabMenuComponent,
    RouterModule,
    ChatbotComponent

  ],
  templateUrl: './home.component.html', // Plantilla HTML externa
  styleUrls: ['./home.component.scss'] // Estilos SCSS externos
})
export class HomeComponent implements OnInit, OnDestroy {
  showChat = false;
  textoBusqueda = ''; // Texto ingresado en la barra de búsqueda
  recetas: RecetaAdm[] = []; // Lista de recetas a mostrar
  busquedaActiva = false; // Indicador de si hay resultados de búsqueda

  private routerSub!: Subscription; // Suscripción para eventos de navegación

  constructor(
    private recetasService: RecetasadmService, // Inyección del servicio de recetas
    private router: Router // Inyección del router para navegación
  ) {
    // Al completar cada navegación, recarga las recetas por defecto
    this.routerSub = this.router.events
      .pipe(filter(evento => evento instanceof NavigationEnd))
      .subscribe(() => {
        this.loadDefault(); // Recarga datos por defecto al cambiar de ruta
      });
  }

  ngOnInit(): void {
    // Se ejecuta al inicializar el componente
    this.loadDefault(); // Carga inicial de recetas por defecto

    this.routerSub = this.router.events.pipe(
      filter(evt => evt instanceof NavigationEnd && (evt as NavigationEnd).urlAfterRedirects === '/home'
)
    ).subscribe(() => {
      this.loadDefault();
    });
    
  }

  ngOnDestroy(): void {
    // Se ejecuta al destruir el componente
    
    this.routerSub.unsubscribe(); // Evita fugas de memoria cancelando la suscripción
  }

  
  toggleChat() {
    this.showChat = !this.showChat;
  }

  minimizarChat() {
    this.showChat = false;
  }


  /** Carga las 5 recetas por defecto y resetea el estado de búsqueda */
  loadDefault(): void {
    this.busquedaActiva = false; // Desactiva búsqueda
    this.textoBusqueda = ''; // Limpia texto de búsqueda
    this.recetasService.listarDefault() // Llama al servicio para listar recetas predeterminadas
      .subscribe(list => this.recetas = list); // Asigna resultado al arreglo de recetas
  }

  /** Reinicia la búsqueda restableciendo valores predeterminados */
  reset(): void {
    this.loadDefault(); // Vuelve a cargar las recetas por defecto
  }

  /** Actualiza el modelo de búsqueda al ingresar texto */
  onInput(event: any): void {
    this.textoBusqueda = (event.target.value || '').trim(); // Elimina espacios al inicio y fin
  }

  /** Realiza la búsqueda de recetas por ingrediente */
  buscarRecetas(): void {
    if (!this.textoBusqueda) { // No hace nada si el campo está vacío
      return;
    }
    // this.busquedaActiva = true; // Comentado: indicador de búsqueda activa
    this.recetasService.buscarPorIngrediente(this.textoBusqueda) // Llama al servicio con el texto de búsqueda
      .subscribe(list => this.recetas = list); // Actualiza lista de recetas con resultados
  }
}
