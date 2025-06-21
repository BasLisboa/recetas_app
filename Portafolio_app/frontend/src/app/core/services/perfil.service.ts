import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  //private baseUrl = 'http://localhost:3000/api/perfil'; 

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el cliente asociado al usuario
   * @param usuarioId ID del usuario logeado
   */
  apiObtCli(usuarioId: number): Observable<any> {
    try {
      const url = `${environment.apiUrl}/perfil?id_usuario=${usuarioId}`;
      console.log('🔍 Llamando a apiObtCli con URL:', url);

      return this.http.get<any>(url).pipe(
        catchError(error => {
          const errMsg = `❌ Error al obtener cliente: ${error.message || error}`;
          console.error(errMsg);
          return throwError(() => error);
        })
      );
    } catch (error: any) {
      const errMsg = `❌ Error en apiObtCli: ${error.message || error}`;
      console.error(errMsg);
      throw error;
    }
  }

  /**
   * Actualiza el perfil del cliente
   * @param usuario Objeto con los datos del cliente
   */
  actualizarPerfil(usuario: any): Observable<any> {
    try {
      const url = `${environment.apiUrl}/perfil/${usuario.id_cliente}`;
      console.log('📤 Llamando a actualizarPerfil con:', usuario);

      return this.http.put<any>(url, usuario).pipe(
        catchError(error => {
          const errMsg = `❌ Error HTTP en actualizarPerfil: ${error.message || error}`;
          console.error(errMsg);
          return throwError(() => error);
        })
      );
    } catch (error: any) {
      const errMsg = `❌ Error en actualizarPerfil: ${error.message || error}`;
      console.error(errMsg);
      throw error;
    }
  }

  obtenerResumenNutricional(userId: number): Observable<any> {
    const url = `${environment.apiUrl}/perfil/resumen-nutricional/${userId}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        console.error('❌ Error al obtener resumen nutricional:', error);
        return throwError(() => error);
      })
    );
  }


  crearCliente(usuario: any): Observable<any> {
    try {
      const url = `${environment.apiUrl}/perfil`; 
      console.log('📤 Llamando a crearCliente con:', usuario);
      // Aquí haces la petición POST enviando el objeto usuario
      return this.http.post<any>(url, usuario).pipe(
        catchError(error => {
          console.error(`❌ Error HTTP en crearCliente: ${error.message || error}`);
          return throwError(() => error);
        })
      );
    } catch (error: any) {
      console.error(`❌ Error en crearCliente: ${error.message || error}`);
      throw error;
    }
  }

}
