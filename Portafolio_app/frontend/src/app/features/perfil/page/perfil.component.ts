import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { TabMenuComponent } from 'src/app/layout/tab-menu/page/tab-menu.component';
import { PerfilService } from 'src/app/core/services/perfil.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalController } from '@ionic/angular';
import { ModalPerfilComponent } from 'src/app/layout/modal-perfil/pages/modal-perfil.component';
import { ImcChartComponent } from './imc-chart.component';
import { MacroChartComponent } from './macro-chart.component';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TabMenuComponent,
    ImcChartComponent,
    MacroChartComponent,
  ]
})
export class PerfilComponent {
  usuario: any = {};
  edad: number | null = null;
  imcValor: number = 0;
  categoriaIMC: string = '';
  imcChartData: any;
  imcChartOptions: any;
  macroChartData: any;
  mostrarCampos: boolean = false; // Controla visibilidad de campos
  private currentModal: HTMLIonModalElement | null = null;

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private perfilService: PerfilService,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit() {
    this.extraerUsrCli();
  }

  /******************************* Backend ********************************* */

  extraerUsrCli() {
    const usuarioId = this.authService.getUserIdFromToken();

    if (usuarioId) {
      this.perfilService.apiObtCli(usuarioId).subscribe(
        cliente => {
          this.usuario = cliente[0] || {};
          this.usuario.peso = Number(this.usuario.peso);
          this.usuario.estatura = Number(this.usuario.estatura);

          this.calcularEdad(this.usuario.fecha_nacimiento);
          this.validarPerfil();
          this.calcularIMC();
          this.configurarGraficos();

          // Aquí activo mostrarCampos si hay al menos un dato relleno
          const camposMostrar = ['peso', 'estatura', 'fecha_nacimiento', 'sexo', 'alergias'];
          this.mostrarCampos = camposMostrar.some(campo => this.usuario[campo]);
        },
        error => console.error('Error obteniendo cliente:', error)
      );
    } else {
      console.warn('No se pudo obtener el ID del usuario desde el token.');
    }
  }

  calcularEdad(fechaNacimientoStr: string) {
    if (!fechaNacimientoStr) {
      this.edad = null;
      return;
    }
    const hoy = new Date();
    const fechaNacimiento = new Date(fechaNacimientoStr);
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const m = hoy.getMonth() - fechaNacimiento.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    this.edad = edad;
  }

  async validarPerfil() {
    const campos = ['peso', 'estatura', 'fecha_nacimiento', 'sexo'];
    const incompletos = campos.filter(campo => !this.usuario[campo]);

    if (incompletos.length > 0) {
      const alert = await this.alertController.create({
        header: 'Perfil incompleto',
        message: `Por favor, completa tu perfil (${incompletos.join(', ')}) para una mejor experiencia.`,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  editarPerfil() {
    this.mostrarCampos = true;
  }

  /******************************* IMC ********************************* */

  calcularIMC() {
    if (!this.usuario.estatura || !this.usuario.peso) return;
    const imc = this.usuario.peso / (this.usuario.estatura ** 2);
    this.imcValor = Number(imc.toFixed(2));

    if (imc < 18.5) {
      this.categoriaIMC = 'Bajo peso';
    } else if (imc >= 18.5 && imc < 24.9) {
      this.categoriaIMC = 'Normal';
    } else if (imc >= 25 && imc < 29.9) {
      this.categoriaIMC = 'Sobrepeso';
    } else {
      this.categoriaIMC = 'Obesidad';
    }
  }

  /******************************* Gráficos ********************************* */

  configurarGraficos() {
    this.imcChartData = {
      labels: ['IMC'],
      datasets: [
        {
          label: 'Índice de Masa Corporal',
          data: [this.imcValor],
          backgroundColor: ['#42A5F5']
        }
      ]
    };

    this.imcChartOptions = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    this.macroChartData = {
      labels: ['Carbohidratos', 'Proteínas', 'Grasas'],
      datasets: [
        {
          data: [50, 30, 20],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }
      ]
    };
  }

  /************************************modal*****************************/
  async abrirModalEditar() {
    const usuarioId = this.authService.getUserIdFromToken();
    console.log("🟢 Entrando a abrirModalEditar");
  
    if (this.currentModal) {
      console.warn("🔴 Ya hay un modal abierto, cerrando...");
      await this.currentModal.dismiss();
      this.currentModal = null;
    }
  
    try {
      this.currentModal = await this.modalCtrl.create({
        component: ModalPerfilComponent,
        componentProps: {
          usuario: this.usuario
        },
        cssClass: 'custom-modal',
        backdropDismiss: true,
        animated: true,
      });
    
      await this.currentModal.present();
    
      const { data, role } = await this.currentModal.onDidDismiss();
      console.log("🔵 Modal cerrado con rol:", role);
      this.currentModal = null;
    
      if (data) {
        console.log("🟢 Datos recibidos del modal:", data);
        this.usuario = { ...this.usuario, ...data };
        this.mostrarCampos = true;

        if (!this.usuario.id_cliente) {
          // Si no existe id_cliente, creamos nuevo cliente
          this.perfilService.crearCliente(this.usuario).subscribe({
            next: (res) => {
              this.usuario.id_cliente = res.id_cliente;  // Guardar nuevo id_cliente
              console.log('✅ Cliente creado con ID:', res.id_cliente);
            },
            error: (err) => console.error('❌ Error al crear cliente:', err)
          });
        } else {
          // Si ya existe id_cliente, actualizamos
          this.perfilService.actualizarPerfil(this.usuario).subscribe({
            next: () => console.log('✅ Perfil actualizado en backend'),
            error: (err) => console.error('❌ Error al actualizar perfil:', err)
          });
        }
      }
    
    } catch (error) {
      console.error("❌ Error al abrir modal de edición:", error);
      this.currentModal = null;
    }
  }

}
