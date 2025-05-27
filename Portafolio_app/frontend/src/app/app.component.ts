import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private afAuth: AngularFireAuth) {
    this.loginAutomaticoAdmin();
  }

  loginAutomaticoAdmin() {
    this.afAuth.authState.subscribe(user => {
      if (!user) {
        this.afAuth.signInWithEmailAndPassword(
          environment.adminUser.email,
          environment.adminUser.password
        ).then(() => {
          console.log('✅ Login automático exitoso con cuenta admin');
        }).catch(error => {
          console.error('❌ Error al hacer login automático:', error);
        });
      } else {
        console.log('🟢 Sesión activa con:', user.email);
      }
    });
  }
}
