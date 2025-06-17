import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { MisRecetasService } from 'src/app/core/services/mis-recetas.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Firebase
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ChatbotComponent } from 'src/app/layout/chatbot/pages/chatbot.component';
import { IngredientesService, Ingrediente } from 'src/app/core/services/ingredientes.service';


@Component({
  selector: 'app-crear-receta-modal',
  templateUrl: './crear-receta-modal.component.html',
  styleUrls: ['./crear-receta-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, FormsModule, ChatbotComponent]
})


export class CrearRecetaModalComponent implements OnInit {

  showChat = false;
  formReceta!: FormGroup;
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
    private navCtrl: NavController,
    private storage: AngularFireStorage,
    private afAuth: AngularFireAuth,
    private ingredientesService: IngredientesService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.formReceta = this.fb.group({
      nombre_receta: ['', [Validators.required]],
      tiempo: ['', [Validators.required]],
      descripcion_receta: ['', [Validators.required]],
      pasos: this.fb.array([])
    });

    this.addPaso();

    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.idUsuario = payload.id;
      console.log('id usuario en recetas: ', this.idUsuario);
      
    }
    // Cargar todos los ingredientes disponibles
    this.ingredientesService.obtenerTodos().subscribe({
      next: (lista) => (this.ingredientesDisponibles = lista),
      error: (err) => console.error('Error al cargar ingredientes:', err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Previsualización de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

    get pasos(): FormArray {
    return this.formReceta.get('pasos') as FormArray;
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

  crearReceta() {
    if (!this.selectedFile) {
      alert('Por favor selecciona una imagen');
      return;
    }

    if (this.formReceta.valid) {
      // Verifica si el usuario está autenticado
      this.afAuth.authState.subscribe(user => {
        if (!user) {
          alert('Debes iniciar sesión para subir una receta');
          return;
        }

        // Usuario autenticado, continuar con la subida
        const filePath = `recetas/${Date.now()}_${this.selectedFile!.name}`;
        const task = this.storage.upload(filePath, this.selectedFile!);

        task.snapshotChanges().pipe(
          finalize(() => {
            this.storage.ref(filePath).getDownloadURL().subscribe(downloadURL => {
              const pasos = this.pasos.controls.map((ctrl, idx) => ({
                numero_paso: idx + 1,
                descripcion_paso: ctrl.get('descripcion_paso')?.value
              }));

              const { nombre_receta, tiempo, descripcion_receta } = this.formReceta.value;
              const receta = {
                nombre_receta,
                tiempo,
                descripcion_receta,
                pasos,
                id_tipo_creador: 2,
                id_usuario_creador: this.idUsuario,
                imagen_url: downloadURL
              };

              this.recetaService.crearReceta(receta, this.ingredientesSeleccionados).subscribe(() => {
                this.navCtrl.navigateBack('/home');
              }, error => {
                console.error('Error al crear receta:', error);
              });
            });
          })
        ).subscribe();
      });
    }
  }


  getNombreMedida(id: number): string {
    const medida = this.unidadesMedida.find(m => m.id === id);
    return medida ? medida.nombre : 'unidad';
  }

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

    
  toggleChat() {
    this.showChat = !this.showChat;
  }

  minimizarChat() {
    this.showChat = false;
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

  GuardadoOK(){
    this.router.navigate(['perfil']);
  }
}



