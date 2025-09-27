import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, MenuController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class AdminHeaderComponent {
  usuarioActual: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private menuController: MenuController
  ) {
    this.cargarUsuarioActual();
  }

  async cargarUsuarioActual() {
    this.usuarioActual = await this.authService.getCurrentUser();
  }

  async cerrarSesion() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  irACatalogo() {
    this.router.navigate(['/catalogo']);
  }

  irAProductos() {
    this.router.navigate(['/productos']);
  }

  abrirMenu() {
    this.menuController.open('admin-menu');
  }

  cerrarMenu() {
    this.menuController.close('admin-menu');
  }
}