import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  // 👉 Redirige a la página de registro
  registrar() {
    this.navCtrl.navigateForward('/registro');
  }

  // 👉 Iniciar sesión con Firebase Authentication
  async iniciarSesion() {
    if (this.email && this.password) {
      console.log('Iniciar sesión con:', this.email, this.password);
      localStorage.setItem('usuarioEmail', this.email);

      try {
        const auth = getAuth();
        await signInWithEmailAndPassword(auth, this.email, this.password);

        this.navCtrl.navigateRoot('/bienvenida');
        console.log('Login exitoso con Firebase 🔥');
      } catch (error: any) {
        console.error('Error Firebase login:', error);
        const fail = await this.alertCtrl.create({
          header: 'Error de autenticación',
          message: error?.message || 'Correo o contraseña incorrectos. Intenta de nuevo.',
          buttons: ['OK']
        });
        await fail.present();
      }
    } else {
      alert('Por favor ingresa tu correo y contraseña ⚠️');
    }
  }

  // 👉 Cierra la sesión y regresa al login
  async cerrarSesion() {
    const auth = getAuth();
    try {
      await auth.signOut();
      localStorage.removeItem('usuarioEmail');
      console.log('Sesión cerrada en Firebase 🚪');
      this.navCtrl.navigateRoot('/login');
    } catch (err) {
      console.error('Error cerrando sesión Firebase:', err);
    }
  }

  // 🔹 Recuperar contraseña con Firebase
  async olvidarContrasena() {
    const alert = await this.alertCtrl.create({
      header: 'Recuperar contraseña',
      message: 'Por favor ingresa tu correo para enviar el enlace de recuperación.',
      inputs: [{ name: 'email', type: 'email', placeholder: 'ejemplo@correo.com' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Enviar',
          handler: async (data) => {
            if (data.email) {
              try {
                const auth = getAuth();
                await sendPasswordResetEmail(auth, data.email);
                const ok = await this.alertCtrl.create({
                  header: 'Éxito',
                  message: 'Se ha enviado un enlace de recuperación a ' + data.email,
                  buttons: ['OK']
                });
                await ok.present();
              } catch (error: any) {
                console.error(error);
                const fail = await this.alertCtrl.create({
                  header: 'Error',
                  message: error?.message || 'No se pudo enviar el correo. Verifica tu email.',
                  buttons: ['OK']
                });
                await fail.present();
              }
            } else {
              const warn = await this.alertCtrl.create({
                header: 'Advertencia',
                message: 'Debes ingresar un correo válido ⚠️',
                buttons: ['OK']
              });
              await warn.present();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // 🔹 Login con Google
  async loginConGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const auth = getAuth();
      await signInWithPopup(auth, provider);

      const user = auth.currentUser;
      if (user?.email) {
        localStorage.setItem('usuarioEmail', user.email);
      }

      this.navCtrl.navigateRoot('/bienvenida');
      console.log('Login con Google exitoso 🔥');
    } catch (error: any) {
      console.error('Error Google Sign-In:', error);
      const fail = await this.alertCtrl.create({
        header: 'Error Google Sign-In',
        message: error?.message || 'No se pudo iniciar sesión con Google.',
        buttons: ['OK']
      });
      await fail.present();
    }
  }
}









