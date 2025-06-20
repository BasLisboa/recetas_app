import { Component, Input , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PerfilService } from 'src/app/core/services/perfil.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-modal-perfil',
  templateUrl: './modal-perfil.component.html',
  styleUrls: ['./modal-perfil.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class ModalPerfilComponent  implements OnInit {

  @Input() usuario: any;
  perfilForm: FormGroup;

  sexos = ['Masculino', 'Femenino', 'Otro'];

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private perfilService: PerfilService,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    // Inicializamos el formulario con validaciones básicas
    this.perfilForm = this.fb.group({
      nombre_cliente: ['', Validators.required],
      apellidos_cliente: ['', Validators.required],
      fecha_nacimiento: [''],
      sexo: [''],
      alergias: [''],
      peso: ['', [Validators.min(1), Validators.max(500)]],
      estatura: ['', [Validators.min(0.3), Validators.max(3)]],
    });
  }

  ngOnInit() {
    if (this.usuario) {
      // Carga los datos actuales en el formulario
      this.perfilForm.patchValue({
        nombre_cliente: this.usuario.nombre_cliente || '',
        apellidos_cliente: this.usuario.apellidos_cliente || '',
        fecha_nacimiento: this.usuario.fecha_nacimiento || '',
        sexo: this.usuario.sexo || '',
        alergias: this.usuario.alergias || '',
        peso: this.usuario.peso || '',
        estatura: this.usuario.estatura || '',
      });
    }
  }


  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }
  
  guardar() {
    console.log('entro a guardar()');

    if (this.perfilForm.valid) {
      const usuarioId = this.authService.getUserIdFromToken();
      const datos = { ...this.usuario, ...this.perfilForm.value, id_usuario: usuarioId };
      this.modalCtrl.dismiss(datos);
    } else {
      // Identificamos errores clave
      const errores = [];

      if (this.perfilForm.get('nombre_cliente')?.invalid) {
        errores.push('El nombre es obligatorio.');
      }
      if (this.perfilForm.get('apellidos_cliente')?.invalid) {
        errores.push('Los apellidos son obligatorios.');
      }
      if (this.perfilForm.get('peso')?.invalid) {
        errores.push('El peso debe ser entre 1 y 500 kg. (formato --> 1,1)');
      }
      if (this.perfilForm.get('estatura')?.invalid) {
        errores.push('La estatura debe ser entre 0.3 m y 3 m. (formato --> 1,1)');
      }

      const mensaje = errores.length > 0 ? errores.join('<br>') : 'Por favor, completa los campos correctamente.';
      this.mostrarAlerta('Campos inválidos', mensaje);
    }
  }


  cancelar() {
    this.modalCtrl.dismiss(null); // Cierra sin guardar
  }

focusedIndex: number | null = null;

focusItem(idx: number) {
  this.focusedIndex = idx;
}

blurItem() {
  this.focusedIndex = null;
}

}
