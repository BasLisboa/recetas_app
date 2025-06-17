import { Component, Input , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PerfilService } from 'src/app/core/services/perfil.service';
import { AuthService } from 'src/app/core/services/auth.service';

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
    private authService: AuthService 
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

  guardar() {
    if (this.perfilForm.valid) {
      // Obtener el id del usuario desde el AuthService
      const usuarioId = this.authService.getUserIdFromToken();

      // Construir el objeto datos incluyendo el id_usuario
      const datos = { ...this.usuario, ...this.perfilForm.value, id_usuario: usuarioId };

      this.modalCtrl.dismiss(datos);
      
    } else {
      alert('Por favor, completa los campos requeridos correctamente.');
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
