// src/app/core/services/recetasadm.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecetaAdm {
  id: number;
  nombre_receta: string;
  imagen_url: string;
}
/** Vista de detalle completo */
export interface PasoDetalle {
  id_paso: number;
  nombre_parte: string;
  numero_paso: number;
  descripcion_paso: string;
  duracion_paso: number;
}

export interface Nutritional {
  calorias: number;
  carbohidratos: number;
  grasas: number;
}

export interface RecetaDetalle {
  id_recetas: number;
  nombre_receta: string;
  descripcion_receta: string;
  tiempo_coccion: number;
  imagen_url: string;
  valoracion_media: number;
  total_valoraciones: number;
  porciones: number;
  nutricional: Nutritional;
  pasos: PasoDetalle[];
}

@Injectable({ providedIn: 'root' })
export class RecetasadmService {
  private apiUrl = 'http://localhost:3000/api/recetasadm';

  listarDefault(): Observable<RecetaAdm[]> {
    return this.http.get<RecetaAdm[]>(this.apiUrl);
  }

  buscarPorIngrediente(ingrediente: string): Observable<RecetaAdm[]> {
    return this.http.get<RecetaAdm[]>(`${this.apiUrl}/buscar?ingrediente=${ingrediente}`);
  }

  getDetalleReceta(id: number): Observable<RecetaDetalle> {
    return this.http.get<RecetaDetalle>(`${this.apiUrl}/${id}`);
  }

  constructor(private http: HttpClient) {}
}
