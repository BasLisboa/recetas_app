import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FavoritosService } from './favoritos.service';

@Injectable({
  providedIn: 'root'
})
export class MisRecetasService {
  //private apiUrl = 'http://localhost:3000/api/recetas';
  //private apiUrlCR = 'http://localhost:3000/api/CrearReceta'

   constructor(private http: HttpClient, private favService: FavoritosService) {}

  obtenerRecetas(idUsuarioCreador: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/recetas?id_usuario_creador=` + idUsuarioCreador);
  }

  eliminarReceta(idReceta: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/recetas/${idReceta}`);
  }

  crearReceta(receta: any, ingredientes: any[]): Observable<any> {
    const payload = { ...receta, ingredientes };
    console.log('Datos enviados a backend:', payload);
    return this.http.post(`${environment.apiUrl}/CrearReceta/`, payload);
  }


  editarReceta(data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/recetas/${data.id_recetas}`, data).pipe(

    catchError(error => {
      console.error('Error al editar receta:', error);
      return throwError(() => error);
    })
    );
  }

  obtenerRecetaPorId(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/recetas/${id}`);
  }

  obtenerMisRecetas(idUsuario: string): Observable<any[]> {
    return forkJoin([
      this.obtenerRecetas(idUsuario),
      this.favService.obtenerFavoritos(idUsuario)
    ]).pipe(
      map(([creadas, favoritas]) => [...creadas as any[], ...favoritas as any[]])
    );
  }


}
