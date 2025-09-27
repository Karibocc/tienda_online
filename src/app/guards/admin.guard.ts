import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const user = await this.authService.getCurrentUser();
    
    if (user && this.authService.isAdmin()) {
      return true; // ✅ Usuario es administrador
    } else {
      // 🔹 Redirigir a login o a página de acceso denegado
      this.router.navigate(['/acceso-denegado']);
      return false;
    }
  }
}