//*******************************************************************************/
//*                                   Cookwell                                  */
//*******************************************************************************/
//* proyecto: Auth Coockwell                                                    */
//* servicio: Auth service                                                      */
//* Desarrollador: Bastian Lisboa (BAS)                                         */
//* Fecha: 22-04-2025                                                           */
//*******************************************************************************/
//* MODIFICACIONES                                                              */
//*******************************************************************************/
// Bastian - Cambio loginUser para recibir token y procesar 06-05-25 bas01      */
//*******************************************************************************/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { catchError, Observable, throwError } from 'rxjs';
import { LogService } from 'src/app/core/services/log.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private TOKEN_KEY = 'token';

  //desde android studio
  //private apiUrl = 'http://10.0.2.2:3000/api/auth';

  //desde localhost
  private apiUrl = 'http://localhost:3000/api/auth';

  // Errores
  err_blancos: string = '';
  err_formato: string = '';

  id_fun: string = '0001';
  nom_ser: string = 'auth.service.ts';


  constructor(private http: HttpClient, private logService: LogService) { } 

  //**************************************************VALIDACIONES DATA*/

  private ValidaBlancos(correo: string, password: string, nombre?: string): { valido: boolean, error: string | null } {
    if (nombre !== undefined && nombre.trim().length === 0) {
      this.err_blancos = "Nombre está vacío o con solo espacios";
      console.log('Nombre está vacío o con solo espacios');
      this.logService.log(this.id_fun,this.nom_ser,this.err_blancos,'error');
      return { valido: false, error: this.err_blancos };
    }

    if (correo.trim().length === 0) {
      this.err_blancos = "Correo está vacío o con solo espacios";
      console.log('Correo está vacío o con solo espacios');
      this.logService.log(this.id_fun,this.nom_ser,this.err_blancos,'error');
      return { valido: false, error: this.err_blancos };
    }

    if (password.trim().length === 0) {
      this.err_blancos = "Contraseña está vacía o con solo espacios";
      console.log('Contraseña está vacía o con solo espacios');
      this.logService.log(this.id_fun,this.nom_ser,this.err_blancos,'error');
      return { valido: false, error: this.err_blancos };
    }

    return { valido: true, error: null };
  }

  private ValidaFormato(correo: string): { valido: boolean, error: string | null } {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const esValido = regex.test(correo.trim());

    if (!esValido) {
      this.err_formato = "Correo inválido. Ej: usuario@correo.cl";
      this.logService.log(this.id_fun,this.nom_ser,this.err_formato,'error');
      return { valido: false, error: this.err_formato }; 
    }

    return { valido: true, error: null };
  }

  validaRegistro(nombre: string, correo: string, password: string): { valido: boolean, error: string | null } {
    console.log('Entro a validaRegistro -> Data:', nombre, correo, password);
    
    const resultadoBlancos = this.ValidaBlancos(correo, password, nombre);
    if (!resultadoBlancos.valido) return resultadoBlancos;

    const resultadoFormato = this.ValidaFormato(correo);
    if (!resultadoFormato.valido) return resultadoFormato;

    return { valido: true, error: null };
  }

  validaLogin(correo: string, password: string): { valido: boolean, error: string | null } {
    const resultadoBlancos = this.ValidaBlancos(correo, password); 
    if (!resultadoBlancos.valido) return resultadoBlancos;

    const resultadoFormato = this.ValidaFormato(correo);
    if (!resultadoFormato.valido) return resultadoFormato;

    return { valido: true, error: null };
  }

  //**************************************************SOLICITUD API */

  registerUser(nombre: string, correo: string, password: string): Observable<any> {
    try {
      // Validación y preparación de los datos antes de hacer la llamada HTTP
      const body = { nombre, email: correo, password };
      const mensaje = 'Enviando datos al endpoint /register';
      console.log('Entro a RegisterUser en front -> auth.service.ts', body);
      this.logService.log(this.id_fun, this.nom_ser, mensaje, 'info');
  
      // Realizando la solicitud HTTP con manejo de errores del servidor
      return this.http.post(`${this.apiUrl}/register`, body).pipe(
        catchError(error => {
          const errMsg = `Error HTTP en registerUser: ${error.message || error}`;
          console.error(errMsg);
          this.logService.log(this.id_fun, this.nom_ser, errMsg, 'error');
          return throwError(() => error);
        })
      );
    } catch (error: any) {
      // Manejo de errores antes de la llamada HTTP (ej. validación de los datos)
      const errMsg = `Error en registerUser: ${error.message || error}`;
      console.error(errMsg);
      this.logService.log(this.id_fun, this.nom_ser, errMsg, 'error');
      throw error;
    }
  }
  
  //bas01-ini

  //loginUser(email: string, password: string) {
  //  const body = { email, password };
  //  //return this.http.post(${this.apiUrl}/login, body);
  //  return this.http.post<any>(`${this.apiUrl}/login`, body);
  //}

  loginUser(email: string, password: string): Observable<any> {
    try {
      const body = { email, password };
      const mensaje = 'Enviando datos al endpoint /login';
      console.log('🔵 Entro a loginUser en front -> auth.service.ts', body);
      this.logService.log(this.id_fun, this.nom_ser, mensaje, 'info');
  
      return this.http.post<any>(`${this.apiUrl}/login`, body).pipe(
        catchError(error => {
          const errMsg = `❌ Error HTTP en loginUser: ${error.message || error}`;
          console.error(errMsg);
          this.logService.log(this.id_fun, this.nom_ser, errMsg, 'error');
          return throwError(() => error);
        })
      );
    } catch (error: any) {
      const errMsg = `❌ Error en loginUser: ${error.message || error}`;
      console.error(errMsg);
      this.logService.log(this.id_fun, this.nom_ser, errMsg, 'error');
      throw error;
    }
  }
  //bas01-fin


//GUARD CORE (EN CONSTRUCCION)
isAuthenticated(): boolean {
  const token = localStorage.getItem('token');

  const mensaje = token
    ? '🔒 Usuario autenticado con token válido'
    : '🔓 Usuario no autenticado, token no encontrado';

  console.log(mensaje);
  this.logService.log(this.id_fun, this.nom_ser, mensaje, token ? 'info' : 'warn');

  return !!token;
}

//obtener user token
public getToken(): string | null {
  return localStorage.getItem(this.TOKEN_KEY);
}

public getUserIdFromToken(): number | null {
  const token = this.getToken();
  if (!token) return null;
  const payload = token.split('.')[1]; // Base64 payload
  const decoded = JSON.parse(atob(payload)); // decodificamos
  
  return decoded?.id || null; 
}

logout(): void {
  localStorage.removeItem('token');
  this.logService.log(this.id_fun, this.nom_ser, '🔴 Usuario cerró sesión', 'info');
}

}

