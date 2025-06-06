// src/app/features/detalle_receta/pages/detalle_receta.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TabMenuComponent } from 'src/app/layout/tab-menu/page/tab-menu.component';
import {
  RecetasadmService,
  RecetaDetalle,
  PasoDetalle,
  NutricionalReceta,
  IngredienteNutri,
  TotalesNutri
} from 'src/app/core/services/recetasadm.service';

@Component({
  selector: 'app-detalle-receta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    TabMenuComponent // para el TabBar
  ],
  templateUrl: './detalle_receta.component.html',
  styleUrls: ['./detalle_receta.component.scss']
})
export class DetalleRecetaComponent implements OnInit {
  receta!: RecetaDetalle;
  pasos: PasoDetalle[] = [];
  nutricional!: NutricionalReceta; // NUEVO: datos que vienen de /api/nutricional/:id
  muestraNutri = false;            // bandera para mostrar la sección

  constructor(
    private route: ActivatedRoute,
    private recetasService: RecetasadmService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      // 1) Cargar datos generales de la receta
      this.recetasService.getDetalleReceta(id).subscribe((res) => {
        console.log('Detalle receta:', res);
        this.receta = res;
        this.pasos = res.pasos;
      });

      // 2) Cargar solo la parte nutricional
      this.recetasService.getNutricionalReceta(id).subscribe(
        (resNutri) => {
          console.log('>>> LLEGÓ nutricional:', resNutri);
          this.nutricional = resNutri;
          this.muestraNutri = true; // activa la visualización de la tarjeta
        },
        (err) => {
          console.error('Error cargando datos nutricionales:', err);
          this.muestraNutri = false;
        }
      );
    }
  }
}
