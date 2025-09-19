import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '@angular/fire/auth'; // 🔹 Tipo de usuario modular

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const user: User | null = await this.authService.getCurrentUser();

    if (user) {
      return true; // ✅ Usuario autenticado → permite acceder
    } else {
      this.router.navigate(['/login']); // 🚪 Redirige al login si no hay usuario
      return false;
    }
  }
}




