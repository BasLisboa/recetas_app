// src/app/core/services/recetasadm.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecetaAdm {
  id: number;
  nombre_receta: string;
  imagen_url: string;
}

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
  nutricional: Nutritional;  // Si tu backend NO incluye este campo, puedes ignorarlo
  pasos: PasoDetalle[];
}

export interface IngredienteNutri {
  id_ingrediente: number;
  nombre_ingrediente: string;
  cantidad_usada: number;
  base_cantidad: number;
  macros_por_base: {
    calorias: number;
    proteinas: number;
    grasas: number;
  };
  contribucion: {
    calorias: number;
    proteinas: number;
    grasas: number;
  };
}

export interface TotalesNutri {
  totalPeso: number;
  totalCalorias: number;
  totalProteinas: number;
  totalGrasas: number;
}

export interface NutricionalReceta {
  id_receta: number;
  detalle_ingredientes: IngredienteNutri[];
  totales: TotalesNutri;
  porCada100gReceta: {
    calorias: number;
    proteinas: number;
    grasas: number;
  };
}

@Injectable({ providedIn: 'root' })
export class RecetasadmService {
  private apiUrl = 'http://localhost:3000/api/recetasadm';

  constructor(private http: HttpClient) {}

  listarDefault(): Observable<RecetaAdm[]> {
    return this.http.get<RecetaAdm[]>(this.apiUrl);
  }

  buscarPorIngrediente(ingrediente: string): Observable<RecetaAdm[]> {
    return this.http.get<RecetaAdm[]>(`${this.apiUrl}/buscar?ingrediente=${ingrediente}`);
  }

  getDetalleReceta(id: number): Observable<RecetaDetalle> {
    return this.http.get<RecetaDetalle>(`${this.apiUrl}/${id}`);
  }

  getNutricionalReceta(id: number): Observable<NutricionalReceta> {
    // AHORA apunta a /api/nutricional/${:id}
    return this.http.get<NutricionalReceta>(`http://localhost:3000/api/nutricional/${id}`);
  }
}
