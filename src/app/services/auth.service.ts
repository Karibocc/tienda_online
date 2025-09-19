import { Injectable, NgZone } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  sendEmailVerification, // ✅ Agregado: para verificación de email
  sendPasswordResetEmail, // ✅ Agregado: para reset de contraseña
  updateProfile // ✅ Agregado: para actualizar perfil de usuario
} from '@angular/fire/auth';
import { Router } from '@angular/router'; // ✅ Agregado: para redireccionamiento
import { BehaviorSubject } from 'rxjs'; // ✅ Agregado: para manejo de estado del usuario

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userData: any; // ✅ Agregado: para almacenar datos del usuario
  private userState = new BehaviorSubject<User | null>(null); // ✅ Agregado: observable del estado del usuario

  constructor(
    private auth: Auth,
    private router: Router, // ✅ Agregado: inyección de Router
    private ngZone: NgZone // ✅ Agregado: para ejecutar código fuera de Angular
  ) {
    // ✅ Agregado: Observer para cambios de estado de autenticación
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this.userData = user;
        this.userState.next(user);
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        this.userState.next(null);
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // 🔹 Registrar usuario
  async register(email: string, password: string): Promise<UserCredential> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      // ✅ Agregado: Enviar verificación de email después del registro
      await sendEmailVerification(result.user);
      return result;
    } catch (error) {
      throw error; // ✅ Agregado: Manejo mejorado de errores
    }
  }

  // 🔹 Iniciar sesión
  async login(email: string, password: string): Promise<UserCredential> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      throw error; // ✅ Agregado: Manejo mejorado de errores
    }
  }

  // 🔹 Cerrar sesión
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      // ✅ Agregado: Limpiar localStorage y redirigir
      localStorage.removeItem('user');
      this.ngZone.run(() => {
        this.router.navigate(['/login']);
      });
    } catch (error) {
      throw error; // ✅ Agregado: Manejo mejorado de errores
    }
  }

  // 🔹 Obtener usuario actual
  getCurrentUser(): Promise<User | null> {
    return new Promise(resolve => {
      const user = this.auth.currentUser;
      if (user) {
        resolve(user); // ✅ si ya está en memoria lo devuelve
      } else {
        onAuthStateChanged(this.auth, u => resolve(u)); // ✅ escucha cambios
      }
    });
  }

  // ✅ Agregado: Verificar si el usuario está logueado
  isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  // ✅ Agregado: Obtener datos del usuario desde localStorage
  getUserData(): any {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user;
  }

  // ✅ Agregado: Enviar email de reset de contraseña
  async forgotPassword(passwordResetEmail: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, passwordResetEmail);
    } catch (error) {
      throw error;
    }
  }

  // ✅ Agregado: Actualizar perfil de usuario
  async updateUserProfile(displayName: string, photoURL: string = ''): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (user) {
        await updateProfile(user, { displayName, photoURL });
      }
    } catch (error) {
      throw error;
    }
  }
}





