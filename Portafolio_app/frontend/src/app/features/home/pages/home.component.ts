import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { RecetasadmService, RecetaAdm } from 'src/app/core/services/recetasadm.service';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TabMenuComponent } from 'src/app/layout/tab-menu/page/tab-menu.component';
import { ChatbotComponent } from 'src/app/layout/chatbot/pages/chatbot.component';
// Animaciones
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

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
  recetas: RecetaAdm[] = [];
  busquedaActiva = false;
  private routerSub!: Subscription;

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
    private router: Router
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
    this.recetasService.buscarPorIngrediente(this.textoBusqueda)
      .subscribe(list => this.recetas = list);
  }

  goToSlide(index: number) {
    this.carouselIndex = index;
  }
}
