import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MisRecetasService {
  private apiUrl = 'http://localhost:3000/api/recetas';
  private apiUrlCR = 'http://localhost:3000/api/CrearReceta'

  constructor(private http: HttpClient) {}

  obtenerRecetas(idUsuarioCreador: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?id_usuario_creador=${idUsuarioCreador}`);
  }

  eliminarReceta(idReceta: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idReceta}`);
  }

  crearReceta(data: any): Observable<any> {
    console.log("Datos enviados a backend:", data);
  return this.http.post(`${this.apiUrlCR}/`, data);
  }

  editarReceta(data: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/${data.id_recetas}`, data).pipe(
    catchError(error => {
      console.error('Error al editar receta:', error);
      return throwError(() => error);
    })
  );
}
}
