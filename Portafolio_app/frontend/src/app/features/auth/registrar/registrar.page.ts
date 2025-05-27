//*******************************************************************************/
//*                                   Cookwell                                  */
//*******************************************************************************/
//* proyecto: Auth Coockwell                                                    */
//* servicio: registro usuario ts                                               */
//* Desarrollador: Bastian Lisboa (BAS)                                         */
//* Fecha: 22-04-2025                                                           */
//*******************************************************************************/
//* MODIFICACIONES                                                              */
//*******************************************************************************/
//*******************************************************************************/
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LogService } from 'src/app/core/services/log.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
  standalone: false,
})
export class RegistrarPage implements OnInit {

  rg_email: string = '';
  rg_password: string = '';
  rg_nombre: string = '';
  id_fun: string = '0001';
  nom_ser: string = 'registrar.page.ts';

  constructor(private authService: AuthService,private toastController: ToastController, private router: Router, private logService: LogService) {}

  ngOnInit() {
  }


  async Registrar() {
    try {
      const resultado = this.authService.validaRegistro(this.rg_nombre, this.rg_email, this.rg_password);
  
      if (!resultado.valido) {
        const errorMsg = `❌ Error de validación: ${resultado.error}`;
        console.log(errorMsg);
        this.logService.log(this.id_fun,this.nom_ser,errorMsg,'error');
        await this.mostrarToast(resultado.error || 'Ocurrió un error desconocido', 'danger');
        return;
      }
  
      const Msg_dt = '✅ Datos válidos, enviando solicitud al backend...';
      console.log(Msg_dt);
  
      this.logService.log(this.id_fun,this.nom_ser,Msg_dt,'ok');
  
      //enviamos al backend
      this.authService.registerUser(this.rg_nombre, this.rg_email, this.rg_password)
      .subscribe({
        next: async (respuesta) => {
          console.log('✅ Registro exitoso:', respuesta);
    
          this.logService.log(this.id_fun, this.nom_ser, JSON.stringify(respuesta), 'success');
    
          await this.mostrarToast('Usuario registrado exitosamente!', 'success');
          this.router.navigate(['auth/login']);


        },
        error: (error) => {
          console.error('❌ Error en el registro:', JSON.stringify(error));
          this.mostrarToast('Error en el registro. Intenta más tarde.', 'danger');
          this.logService.log(this.id_fun, this.nom_ser, JSON.stringify(error), 'error');
        }
      });
    
  
    } catch (error) {
      console.log("❌ Error inesperado:", error);
      await this.mostrarToast('Error inesperado al validar datos', 'danger');
    }
  }
  
  
  
  private async mostrarToast(mensaje: string, color: 'danger' | 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color,
      position: 'top',
    });
    toast.present();
  }
    

}
