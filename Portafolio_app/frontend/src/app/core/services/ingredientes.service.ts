import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


export interface Ingrediente {
  id_ingrediente: number;
  nombre_ingrediente: string;
}

@Injectable({
  providedIn: 'root'
})
export class IngredientesService {

  //private apiUrl = 'http://localhost:3000/api/ingredientes';

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<Ingrediente[]> {
    const url = `${environment.apiUrl}/ingredientes`;
    return this.http.get<Ingrediente[]>(url);
  }

  buscarIngredientes(nombre: string): Observable<string[]> {
    const url = `${environment.apiUrl}/ingredientes/buscar?texto=${encodeURIComponent(nombre)}`;
    console.log('🌐 [FRONTEND] Llamada HTTP a:', url);
    return this.http.get<string[]>(url);
  }
}
