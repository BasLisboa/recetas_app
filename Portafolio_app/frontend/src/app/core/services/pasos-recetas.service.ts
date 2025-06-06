import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface PasoReceta {
  id_paso: number;
  id_recetas: number;
  nombre_parte: string;
  numero_paso: number;
  descripcion_paso: string;
  duracion_paso: number;
}

@Injectable({ providedIn: 'root' })
export class PasosRecetasService {
  constructor(private http: HttpClient) {}

  obtenerPasos(idReceta: string): Observable<PasoReceta[]> {
    return this.http.get<PasoReceta[]>(
      `${environment.apiUrl}/pasos-recetas/${idReceta}`
    );
  }
}
