import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { MisRecetasService } from 'src/app/core/services/mis-recetas.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// Firebase
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ChatbotComponent } from 'src/app/layout/chatbot/pages/chatbot.component';


@Component({
  selector: 'app-crear-receta-modal',
  templateUrl: './crear-receta-modal.component.html',
  styleUrls: ['./crear-receta-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule,ChatbotComponent]
})
export class CrearRecetaModalComponent implements OnInit {

  showChat = false;
  formReceta!: FormGroup;
  selectedFile: File | null = null;
  previewImage: string | null = null;
  idUsuario: string = '';
  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private recetaService: MisRecetasService,
    private navCtrl: NavController,
    private storage: AngularFireStorage,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.formReceta = this.fb.group({
      nombre_receta: ['', [Validators.required]],
      tiempo: ['', [Validators.required]],
      descripcion_receta: ['', [Validators.required]]
    });


    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.idUsuario = payload.id;
      console.log("id usuario en recetas: ",this.idUsuario );
      
    }
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
              const receta = {
                ...this.formReceta.value,
                id_tipo_creador: 2,
                id_usuario_creador: this.idUsuario,
                imagen_url: downloadURL
              };

              this.recetaService.crearReceta(receta).subscribe(() => {
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



  cerrarModal() {
    this.modalCtrl.dismiss();
  }

    
  toggleChat() {
    this.showChat = !this.showChat;
  }

  minimizarChat() {
    this.showChat = false;
  }
}



