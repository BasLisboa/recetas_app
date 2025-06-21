import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Favorito {
  id_recetas: string;
  nombre_receta: string;
  tiempo: string;
  descripcion: string;
  imagen_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  constructor(private http: HttpClient) {}

  agregarFavorito(idUsuario: number, idReceta: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/favoritos`, {
      id_usuario: idUsuario,
      id_receta: idReceta
    });
  }


  obtenerFavoritos(idUsuario: string): Observable<Favorito[]> {
    return this.http.get<Favorito[]>(`${environment.apiUrl}/favoritos?id_usuario=${idUsuario}`);
  }

  eliminarFavorito(idReceta: string, idUsuario: string): Observable<any> {
    const url = `${environment.apiUrl}/favoritos/${idReceta}?id_usuario=${idUsuario}`;
    return this.http.delete(url);
  }
}