//*******************************************************************************/
//*                                   Cookwell                                  */
//*******************************************************************************/
//* proyecto: General Coockwell                                                 */
//* servicio: log historico app service                                         */
//* Desarrollador: Bastian Lisboa (BAS)                                         */
//* Fecha: 22-04-2025                                                           */
//*******************************************************************************/
//* MODIFICACIONES                                                              */
//*******************************************************************************/
//*******************************************************************************/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })


export class LogService {

  //private apiUrl = 'http://localhost:3000/api/logs';
  
  constructor(private http: HttpClient) {}

  log(idFun: string = '', nombreServicio: string,mensaje: string, estado: string = ''): void {
    const sysdate = new Date(); 

    const options = { timeZone: 'America/Santiago', hour12: false };
    const fecha = sysdate.toLocaleDateString('es-CL', { timeZone: 'America/Santiago' }); //dd/mm/yyyy
    const hora = sysdate.toLocaleTimeString('es-CL', options);  //hh:mm:ss
    const fechaCompleta = `${fecha} ${hora}`;
    

    const log = {
      id_fun: idFun,
      nombre_servicio: nombreServicio,
      mensaje: mensaje,
      estado: estado,
      fecha: fechaCompleta
    };

    console.log(log);
    this.http.post(`${environment.apiUrl}/logs/log`, log).subscribe({
      next: (response) => {
        const lastLogResponse = response;
        console.log('✅ Log enviado correctamente', lastLogResponse);
      },
      error: (err) => {
        console.error('❌ Error al enviar log:', err);
      }
    });


  }
}
