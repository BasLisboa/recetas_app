import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MisRecetasService } from 'src/app/core/services/mis-recetas.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


@Component({
  standalone: true,
  selector: 'app-receta-compartida',
  templateUrl: './receta-compartida.page.html',
  styleUrls: ['./receta-compartida.page.scss'],
  imports: [
    CommonModule,     
    IonicModule       
  ],
})
export class RecetaCompartidaPage implements OnInit {

  receta: any;
  cargando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private misRecetasService: MisRecetasService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.misRecetasService.obtenerRecetaPorId(id).subscribe(receta => {
        this.receta = receta;
        this.cargando = false;
      }, error => {
        console.error('Error al cargar la receta:', error);
        this.cargando = false;
      });
    }
  }
}
