import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController, LoadingController } from '@ionic/angular';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // ✅ Agregado: Importar el servicio de autenticación

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class RegistroPage {
  nombre: string = '';
  apellido: string = '';
  correo: string = '';
  contrasena: string = '';

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController, // ✅ Agregado: Para mostrar carga durante el registro
    private auth: Auth, // ✅ Agregado: Inyectar Auth de Angular Fire
    private router: Router, // ✅ Agregado: Para navegación mejorada
    private authService: AuthService // ✅ Agregado: Usar el servicio de autenticación
  ) {}

  // ✅ Función para registrar usuario
  async registrarUsuario() {
    console.log('Datos ingresados:');
    console.log('Nombre:', this.nombre);
    console.log('Apellido:', this.apellido);
    console.log('Correo:', this.correo);
    console.log('Contraseña:', this.contrasena);

    // ✅ Agregado: Validación más completa
    if (!this.nombre || !this.apellido || !this.correo || !this.contrasena) {
      const warn = await this.alertCtrl.create({
        header: 'Campos incompletos',
        message: 'Debes completar todos los campos ⚠️',
        buttons: ['OK']
      });
      await warn.present();
      return;
    }

    // ✅ Agregado: Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.correo)) {
      const warn = await this.alertCtrl.create({
        header: 'Correo inválido',
        message: 'Por favor ingresa un correo electrónico válido ⚠️',
        buttons: ['OK']
      });
      await warn.present();
      return;
    }

    // ✅ Agregado: Validación de longitud de contraseña
    if (this.contrasena.length < 6) {
      const warn = await this.alertCtrl.create({
        header: 'Contraseña muy corta',
        message: 'La contraseña debe tener al menos 6 caracteres ⚠️',
        buttons: ['OK']
      });
      await warn.present();
      return;
    }

    // ✅ Agregado: Mostrar indicador de carga
    const loading = await this.loadingCtrl.create({
      message: 'Creando cuenta...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // ✅ Modificado: Usar el servicio de autenticación en lugar de la función directa
      const userCredential = await this.authService.register(this.correo, this.contrasena);

      // ✅ Agregado: Actualizar perfil del usuario con nombre y apellido
      await this.authService.updateUserProfile(`${this.nombre} ${this.apellido}`);

      // ✅ Agregado: Enviar verificación de email
      // Nota: Esto requiere que agregues sendEmailVerification a tu AuthService

      await loading.dismiss();

      const ok = await this.alertCtrl.create({
        header: 'Registro exitoso',
        message: 'Usuario registrado correctamente en Firebase ✅',
        buttons: ['OK']
      });
      await ok.present();

      // 🔹 Redirige al login después del registro
      this.router.navigateByUrl('/login', { replaceUrl: true });
      console.log('Usuario registrado y redirigido al login 🚀');

    } catch (error: any) {
      await loading.dismiss();

      console.error('Error registrando usuario en Firebase:', error);

      // ✅ Agregado: Mensajes de error más específicos
      let errorMessage = 'No se pudo registrar el usuario. Verifica tu correo o contraseña.';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este correo electrónico ya está en uso.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'El formato del correo electrónico no es válido.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
      }

      const fail = await this.alertCtrl.create({
        header: 'Error',
        message: errorMessage,
        buttons: ['OK']
      });
      await fail.present();
    }
  }

  // ✅ Función para volver al login sin registrar
  volverLogin() {
    this.navCtrl.navigateBack('/login');
  }
}
