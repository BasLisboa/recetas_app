// src/app/features/detalle_receta/pages/detalle_receta.component.ts
import { Component, OnInit }  from '@angular/core';
import { ActivatedRoute, RouterModule }      from '@angular/router';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';
import { IonicModule }         from '@ionic/angular';
import { TabMenuComponent }    from 'src/app/layout/tab-menu/page/tab-menu.component';
import {
  RecetasadmService,
  RecetaDetalle,
  PasoDetalle
} from 'src/app/core/services/recetasadm.service';
import { tap } from 'rxjs/internal/operators/tap';

@Component({
  selector: 'app-detalle-receta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    TabMenuComponent   // ← para el TabBar
  ],
  templateUrl: './detalle_receta.component.html',
  styleUrls: ['./detalle_receta.component.scss']
})
export class DetalleRecetaComponent implements OnInit {
  receta!: RecetaDetalle;
  pasos: PasoDetalle[] = [];
  constructor(
    private route: ActivatedRoute,
    private recetasService: RecetasadmService
  ) {}
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.recetasService.getDetalleReceta(id)
      .subscribe(res => {
        this.receta = res;
        this.pasos  = res.pasos;
      });
  }
}
