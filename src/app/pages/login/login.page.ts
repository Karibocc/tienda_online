import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class LoginPage implements OnInit {
  credenciales = {
    email: '',
    password: ''
  };
  
  recordarme: boolean = false;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    // Cargar credenciales guardadas si "Recordarme" estaba activado
    this.cargarCredencialesGuardadas();
  }

  // Cargar credenciales desde localStorage
  private cargarCredencialesGuardadas() {
    const emailGuardado = localStorage.getItem('rememberEmail');
    const recordarme = localStorage.getItem('rememberMe') === 'true';
    
    if (recordarme && emailGuardado) {
      this.credenciales.email = emailGuardado;
      this.recordarme = true;
    }
  }

  // Guardar credenciales en localStorage
  private guardarCredenciales() {
    if (this.recordarme) {
      localStorage.setItem('rememberEmail', this.credenciales.email);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberEmail');
      localStorage.removeItem('rememberMe');
    }
  }

  async login() {
    // Validaciones básicas
    if (!this.credenciales.email || !this.credenciales.password) {
      this.mostrarToast('Por favor, completa todos los campos', 'warning');
      return;
    }

    if (!this.validarEmail(this.credenciales.email)) {
      this.mostrarToast('Por favor, ingresa un email válido', 'warning');
      return;
    }

    this.isLoading = true;

    // Mostrar loading
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // Intentar login
      await this.authService.login(this.credenciales.email, this.credenciales.password);
      
      // Guardar credenciales si "Recordarme" está activado
      this.guardarCredenciales();

      // Ocultar loading
      await loading.dismiss();
      this.isLoading = false;

      // Mostrar mensaje de éxito
      await this.mostrarToast('¡Inicio de sesión exitoso!', 'success');

      // Redirigir según el rol del usuario
      this.redirigirSegunRol();

    } catch (error: any) {
      // Ocultar loading
      await loading.dismiss();
      this.isLoading = false;

      // Manejar errores específicos de Firebase
      let mensajeError = 'Error al iniciar sesión. Por favor, intenta nuevamente.';
      
      switch (error.code) {
        case 'auth/invalid-email':
          mensajeError = 'El formato del email no es válido.';
          break;
        case 'auth/user-disabled':
          mensajeError = 'Esta cuenta ha sido deshabilitada.';
          break;
        case 'auth/user-not-found':
          mensajeError = 'No existe una cuenta con este email.';
          break;
        case 'auth/wrong-password':
          mensajeError = 'La contraseña es incorrecta.';
          break;
        case 'auth/too-many-requests':
          mensajeError = 'Demasiados intentos fallidos. Intenta más tarde.';
          break;
        case 'auth/network-request-failed':
          mensajeError = 'Error de conexión. Verifica tu internet.';
          break;
      }

      this.mostrarToast(mensajeError, 'danger');
    }
  }

  // Redirigir según el rol del usuario
  private redirigirSegunRol() {
    if (this.authService.isAdmin()) {
      // Usuario administrador → ir a gestión de productos
      this.router.navigate(['/productos']);
      console.log('Redirigiendo a panel de administrador');
    } else {
      // Usuario normal → ir al catálogo
      this.router.navigate(['/catalogo']);
      console.log('Redirigiendo a catálogo');
    }
  }

  // Validar formato de email
  private validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Login rápido para testing (eliminar en producción)
  async loginRapido(tipo: 'admin' | 'usuario') {
    if (tipo === 'admin') {
      this.credenciales.email = 'admin@tienda.com';
      this.credenciales.password = 'admin123';
    } else {
      this.credenciales.email = 'usuario@tienda.com';
      this.credenciales.password = 'usuario123';
    }
    
    // Auto-login después de 500ms
    setTimeout(() => {
      this.login();
    }, 500);
  }

  // Navegar a registro
  irARegistro() {
    this.router.navigate(['/registro']);
  }

  // Olvidé mi contraseña
  async olvidePassword() {
    if (!this.credenciales.email) {
      this.mostrarToast('Por favor, ingresa tu email primero', 'warning');
      return;
    }

    if (!this.validarEmail(this.credenciales.email)) {
      this.mostrarToast('Por favor, ingresa un email válido', 'warning');
      return;
    }

    try {
      await this.authService.forgotPassword(this.credenciales.email);
      this.mostrarToast('Se ha enviado un email para restablecer tu contraseña', 'success');
    } catch (error: any) {
      let mensajeError = 'Error al enviar el email de recuperación.';
      
      if (error.code === 'auth/user-not-found') {
        mensajeError = 'No existe una cuenta con este email.';
      }
      
      this.mostrarToast(mensajeError, 'danger');
    }
  }

  // Mostrar toast/notificación
  private async mostrarToast(mensaje: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
      color: color,
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  // Limpiar formulario
  limpiarFormulario() {
    this.credenciales = {
      email: '',
      password: ''
    };
  }
}