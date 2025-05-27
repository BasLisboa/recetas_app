import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngredientesService {

  private apiUrl = 'http://localhost:3000/api/ingredientes';

  constructor(private http: HttpClient) {}

  buscarIngredientes(nombre: string): Observable<string[]> {
    const url = `${this.apiUrl}/buscar?texto=${encodeURIComponent(nombre)}`;
    console.log('🌐 [FRONTEND] Llamada HTTP a:', url);
    return this.http.get<string[]>(url);
  }
}
