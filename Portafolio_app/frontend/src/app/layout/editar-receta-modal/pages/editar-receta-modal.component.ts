import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MisRecetasService } from 'src/app/core/services/mis-recetas.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-editar-receta-modal',
  templateUrl: './editar-receta-modal.component.html',
  styleUrls: ['./editar-receta-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class ModalEditarRecetaComponent implements OnInit {

  @Input() receta: any;

  RecetaForm!: FormGroup;
  selectedFile: File | null = null;
  previewImage: string | null = null;
  idUsuario: string = '';

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private recetaService: MisRecetasService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.RecetaForm = this.fb.group({
      nombre_receta: ['', [Validators.required]],
      tiempo: ['', [Validators.required]],
      descripcion_receta: ['', [Validators.required]]
    });

    // Cargar datos existentes de la receta
    if (this.receta) {
      this.RecetaForm.patchValue({
        nombre_receta: this.receta.nombre_receta || '',
        tiempo: this.receta.tiempo || '',
        descripcion_receta: this.receta.descripcion_receta || ''
      });

      this.previewImage = this.receta.imagen_url || null;

      // Extraemos el id del usuario si está presente
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.idUsuario = payload.id;
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  guardar() {
    if (this.RecetaForm.invalid) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    const recetaActualizada = {
      ...this.receta,
      ...this.RecetaForm.value,
      id_usuario_creador: this.idUsuario
    };

    // Si se ha seleccionado una nueva imagen, la subimos
    if (this.selectedFile) {
      const filePath = `recetas/${Date.now()}_${this.selectedFile.name}`;
      const task = this.storage.upload(filePath, this.selectedFile);

      task.snapshotChanges().pipe(
        finalize(() => {
          this.storage.ref(filePath).getDownloadURL().subscribe(downloadURL => {
            recetaActualizada.imagen_url = downloadURL;

            this.enviarActualizacion(recetaActualizada);
          });
        })
      ).subscribe();
    } else {
      // No hay imagen nueva
      this.enviarActualizacion(recetaActualizada);
    }
  }

  enviarActualizacion(receta: any) {
<<<<<<< HEAD
    console.log(receta.idUsuario);
=======
    console.log(receta);
>>>>>>> 2383b4f043ff09478893cdbf1a8bce035d54f531
    this.recetaService.editarReceta(receta).subscribe(() => {
      this.modalCtrl.dismiss(receta); // Devolver receta actualizada
    }, error => {
      console.error('Error al actualizar la receta:', error);
    });
  }

  cancelar() {
    this.modalCtrl.dismiss(null);
  }
}
