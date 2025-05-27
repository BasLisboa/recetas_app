
//*******************************************************************************/
//*                                   Cookwell                                  */
//*******************************************************************************/
//* proyecto: Auth Cookwell                                                     */
//* servicio: login usuario                                                     */
//* Desarrollador: Bastian Lisboa (BAS) - Ivan Ahumada (IVA)          */
//* Fecha: 28-04-2025                                                           */
//*******************************************************************************/
//* MODIFICACIONES      
/*  Practicamente es una copia al modlo de registrar, solo con los 2 datos requeridos
para la autentiacion                            */
//*******************************************************************************/
//* Archivo adaptado para LOGIN de usuarios                                     */
//*******************************************************************************/

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LogService } from 'src/app/core/services/log.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  lg_email: string = '';
  lg_password: string = '';
  id_fun: string = '0001';
  nom_ser: string = 'login.page.ts';

  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router,
    private logService: LogService,
  ) {}

  ngOnInit() {}

  async iniciarSesion() {
    if (!this.lg_email || !this.lg_password) {
      await this.mostrarToast('Debes ingresar correo y contraseña', 'danger');
      return;
    }
  
    console.log("🔵 Intentando iniciar sesión...");
  
    try {
      this.authService.loginUser(this.lg_email, this.lg_password).subscribe({
        next: async (respuesta) => {
          console.log('Respuesta del backend:', respuesta);
  
          const { token, usuario } = respuesta;
  
          if (token) {
            localStorage.setItem('token', token);
            this.logService.log(this.id_fun, this.nom_ser, `Token generado: ${token}`, 'success');
  
            console.log('✅ Inicio de sesión exitoso');
            this.logService.log(this.id_fun, this.nom_ser, '✅ Inicio de sesión exitoso', 'success');
  
            await this.mostrarToast('Inicio de sesión exitoso!', 'success');
            this.router.navigate(['/home']);
          } else {
            console.error('⚠️ No se recibió token');
            this.logService.log(this.id_fun, this.nom_ser, 'No se recibió token', 'error');
            this.router.navigate(['auth/login']);
          }
        },
        error: async (err) => {
          console.error('❌ Error al iniciar sesión:', err);
          this.logService.log(this.id_fun, this.nom_ser, err.message || err, 'error');
          await this.mostrarToast('Correo o contraseña inválidos', 'danger');
        }
      });
    } catch (err) {
      console.error('❌ Error inesperado:', err);
      await this.mostrarToast('Error inesperado al iniciar sesión', 'danger');
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
  registrarse() {
    this.router.navigate(['auth/registrar']);
  }

}
