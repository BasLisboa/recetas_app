import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecetasadmService, RecetaAdm } from 'src/app/core/services/recetasadm.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TabMenuComponent } from 'src/app/layout/tab-menu/page/tab-menu.component';

@Component({
  selector: 'app-detalle-receta',
  templateUrl: './detalle_receta.component.html',
  styleUrls: ['./detalle_receta.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TabMenuComponent]
})
export class DetalleRecetaComponent implements OnInit {
  receta!: RecetaAdm;

  constructor(
    private route: ActivatedRoute,
    private svc: RecetasadmService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.obtenerPorId(id).subscribe(r => this.receta = r);
  }
}
