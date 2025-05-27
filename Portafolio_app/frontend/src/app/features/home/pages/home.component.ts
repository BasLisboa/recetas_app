// home.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { RecetasadmService, RecetaAdm } from 'src/app/core/services/recetasadm.service';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TabMenuComponent } from 'src/app/layout/tab-menu/page/tab-menu.component';
import { ChatbotComponent } from 'src/app/layout/chatbot/pages/chatbot.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabMenuComponent,
    RouterModule,
    ChatbotComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  showChat = false;
  textoBusqueda = '';
  recetas: RecetaAdm[] = [];
  busquedaActiva = false;

  private routerSub!: Subscription;

  constructor(
    private recetasService: RecetasadmService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDefault();

    this.routerSub = this.router.events.pipe(
      filter(evt => evt instanceof NavigationEnd && (evt as NavigationEnd).urlAfterRedirects === '/home')
    ).subscribe(() => {
      this.loadDefault();
    });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  toggleChat() {
    this.showChat = !this.showChat;
  }

  minimizarChat() {
    this.showChat = false;
  }

  /** Carga las 5 recetas por defecto y resetea el estado de búsqueda */
  loadDefault() {
    this.busquedaActiva = false;
    this.textoBusqueda = '';
    this.recetasService.listarDefault()
      .subscribe(list => this.recetas = list);
  }

  /** Llamada desde (ionClear) y desde el tab Home para volver al inicio */
  reset() {
    this.loadDefault();
  }

  onInput(event: any) {
    this.textoBusqueda = (event.target.value || '').trim();
  }

  buscarRecetas() {
    if (!this.textoBusqueda) { return; }
    //this.busquedaActiva = true;
    this.recetasService.buscarPorIngrediente(this.textoBusqueda)
      .subscribe(list => this.recetas = list);
  }
  
}
