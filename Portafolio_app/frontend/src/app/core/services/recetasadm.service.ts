import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface RecetaAdm {
  id: number;
  nombre_receta: string;
  imagen_url: string;
}

@Injectable({ providedIn: 'root' })
export class RecetasadmService {
  private apiUrl = 'http://localhost:3000/api/recetasadm';

  constructor(private http: HttpClient) {}

  listarDefault(): Observable<RecetaAdm[]> {
    return this.http.get<RecetaAdm[]>(this.apiUrl);
  }

  buscarPorIngrediente(ingrediente: string): Observable<RecetaAdm[]> {
    const url = `${this.apiUrl}/buscar?ingrediente=${encodeURIComponent(ingrediente)}`;
    return this.http.get<RecetaAdm[]>(url);
  }
  /** Obtiene una receta por su id */
  obtenerPorId(id: number): Observable<RecetaAdm> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<RecetaAdm>(url);
  }
}
