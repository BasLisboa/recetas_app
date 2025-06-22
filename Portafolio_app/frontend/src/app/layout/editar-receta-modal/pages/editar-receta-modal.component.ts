import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { MisRecetasService } from 'src/app/core/services/mis-recetas.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray,FormsModule } from '@angular/forms';
import { PasosRecetasService } from 'src/app/core/services/pasos-recetas.service';
import { IngredientesService, Ingrediente } from 'src/app/core/services/ingredientes.service';
import { RecetasadmService } from 'src/app/core/services/recetasadm.service';

@Component({
  selector: 'app-editar-receta-modal',
  templateUrl: './editar-receta-modal.component.html',
  styleUrls: ['./editar-receta-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule]
})
export class ModalEditarRecetaComponent implements OnInit {

  @Input() receta: any;

  RecetaForm!: FormGroup;
  selectedFile: File | null = null;
  previewImage: string | null = null;
  idUsuario: string = '';
  ingredientesDisponibles: Ingrediente[] = [];
  ingredientesSeleccionados: { id_ingrediente: number; id_medida: number; cantidad: number; nombre_ingrediente: string; }[] = [];
  ingredienteSeleccionado?: Ingrediente;
  cantidadIngrediente = 1;
  idMedida = 1;
  unidadesMedida = [
    { id: 1, nombre: 'unidad' },
    { id: 2, nombre: 'gramos' },
    { id: 3, nombre: 'tazas' }
  ];

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private recetaService: MisRecetasService,
    private storage: AngularFireStorage,
    private pasosService: PasosRecetasService,
    private ingredientesService: IngredientesService,
    private recetasadmService: RecetasadmService
  ) {}

  ngOnInit() {
    this.RecetaForm = this.fb.group({
      nombre_receta: ['', [Validators.required]],
      tiempo: ['', [Validators.required]],
      descripcion_receta: ['', [Validators.required]],
      pasos: this.fb.array([])
    });

    this.ingredientesService.obtenerTodos().subscribe({
      next: lista => (this.ingredientesDisponibles = lista),
      error: err => console.error('Error al cargar ingredientes:', err)
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

      // Cargar pasos existentes
      this.pasosService.obtenerPasos(this.receta.id_recetas).subscribe((pasos) => {
        if (pasos.length === 0) {
          this.addPaso();
        } else {
          pasos.forEach((p) => {
            this.pasos.push(
              this.fb.group({
                numero_paso: [p.numero_paso],
                descripcion_paso: [p.descripcion_paso, Validators.required]
              })
            );
          });
        }
      });

       // Cargar ingredientes existentes de la receta
      this.recetasadmService.getNutricionalReceta(this.receta.id_recetas).subscribe({
        next: (data) => {
          this.ingredientesSeleccionados = data.detalle_ingredientes.map((ing: any) => {
            const unidad = this.unidadesMedida.find(u => u.nombre === ing.unidad_medida || u.nombre === ing.unidad_medida_plural);
            return {
              id_ingrediente: ing.id_ingrediente,
              nombre_ingrediente: ing.nombre_ingrediente,
              cantidad: ing.cantidad_ing,
              id_medida: unidad ? unidad.id : 1
            };
          });
        },
        error: err => console.error('Error al obtener ingredientes:', err)
      });
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

  get pasos(): FormArray {
    return this.RecetaForm.get('pasos') as FormArray;
  }

  addPaso() {
    const paso = this.fb.group({
      numero_paso: [this.pasos.length + 1],
      descripcion_paso: ['', Validators.required]
    });
    this.pasos.push(paso);
  }

  removePaso(index: number) {
    this.pasos.removeAt(index);
    this.actualizarNumeros();
  }

  reorderPasos(ev: any) {
    const from = ev.detail.from;
    const to = ev.detail.to;
    const item = this.pasos.at(from);
    this.pasos.removeAt(from);
    this.pasos.insert(to, item);
    this.actualizarNumeros();
    ev.detail.complete();
  }

  private actualizarNumeros() {
    this.pasos.controls.forEach((ctrl, idx) => {
      ctrl.get('numero_paso')?.setValue(idx + 1);
    });
  }

  agregarIngrediente() {
    if (!this.ingredienteSeleccionado) {
      return;
    }
    this.ingredientesSeleccionados.push({
      id_ingrediente: this.ingredienteSeleccionado.id_ingrediente,
      nombre_ingrediente: this.ingredienteSeleccionado.nombre_ingrediente,
      id_medida: this.idMedida,
      cantidad: this.cantidadIngrediente,
    });
    this.ingredienteSeleccionado = undefined;
    this.cantidadIngrediente = 1;
  }

  eliminarIngrediente(index: number) {
    this.ingredientesSeleccionados.splice(index, 1);
  }

  getNombreMedida(id: number): string {
    const medida = this.unidadesMedida.find(m => m.id === id);
    return medida ? medida.nombre : 'unidad';
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

    const pasosData = this.pasos.controls.map((ctrl, idx) => ({
      numero_paso: idx + 1,
      descripcion_paso: ctrl.get('descripcion_paso')?.value
    }));

    // Si se ha seleccionado una nueva imagen, la subimos
    if (this.selectedFile) {
      const filePath = `recetas/${Date.now()}_${this.selectedFile.name}`;
      const task = this.storage.upload(filePath, this.selectedFile);

      task.snapshotChanges().pipe(
        finalize(() => {
          this.storage.ref(filePath).getDownloadURL().subscribe(downloadURL => {
            recetaActualizada.imagen_url = downloadURL;

            this.enviarActualizacion(recetaActualizada, pasosData);
          });
        })
      ).subscribe();
    } else {
      // No hay imagen nueva
      this.enviarActualizacion(recetaActualizada, pasosData);
    }
  }

  enviarActualizacion(receta: any, pasos: any[]) {

    console.log(receta.idUsuario);

    this.recetaService.editarReceta(receta).subscribe(() => {
      this.pasosService.actualizarPasos(receta.id_recetas, pasos).subscribe(() => {
        this.recetaService.actualizarIngredientes(receta.id_recetas, this.ingredientesSeleccionados).subscribe(() => {
          this.modalCtrl.dismiss(receta);
        }, err => {
          console.error('Error al actualizar ingredientes:', err);
        });
      }, err => {
        console.error('Error al actualizar pasos:', err);
      });
    }, error => {
      console.error('Error al actualizar la receta:', error);
    });
  }

  cancelar() {
    this.modalCtrl.dismiss(null);
  }


  focusedIndex: number|null = null;
  focusItem(idx:number) { this.focusedIndex = idx; }
  blurItem() { this.focusedIndex = null; }

}
