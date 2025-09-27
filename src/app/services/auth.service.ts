import { Injectable, NgZone } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

// 🔹 Interface para usuario con rol
export interface UserWithRole {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  role: 'admin' | 'user';
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userData: UserWithRole | null = null;
  private userState = new BehaviorSubject<UserWithRole | null>(null);
  public userState$: Observable<UserWithRole | null> = this.userState.asObservable();
  
  // 🔹 Lista de emails de administradores (puedes agregar más)
  private readonly ADMIN_EMAILS = [
    'admin@tienda.com', 
    'administrador@tienda.com',
    'admin@gmail.com',
    'lesly@gmail.com'
  ];

  constructor(
    private auth: Auth,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.initAuthStateListener();
  }

  /**
   * Inicializa el listener del estado de autenticación
   */
  private initAuthStateListener(): void {
    onAuthStateChanged(this.auth, (user: User | null) => {
      this.ngZone.run(() => {
        if (user) {
          const userWithRole: UserWithRole = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            role: this.isAdminUser(user.email) ? 'admin' : 'user',
            createdAt: user.metadata.creationTime || new Date().toISOString()
          };
          
          this.userData = userWithRole;
          this.userState.next(userWithRole);
          localStorage.setItem('user', JSON.stringify(userWithRole));
          
          console.log('Usuario autenticado:', userWithRole);
        } else {
          this.userData = null;
          this.userState.next(null);
          localStorage.setItem('user', 'null');
          console.log('Usuario no autenticado');
        }
      });
    });
  }

  /**
   * Verifica si el email pertenece a un administrador
   */
  private isAdminUser(email: string | null): boolean {
    if (!email) return false;
    return this.ADMIN_EMAILS.includes(email.toLowerCase());
  }

  /**
   * REGISTRAR NUEVO USUARIO
   */
  async register(email: string, password: string, displayName?: string): Promise<UserCredential> {
    try {
      // Validar email
      if (!this.validarEmail(email)) {
        throw new Error('El formato del email no es válido');
      }

      // Validar contraseña
      if (!this.validarPassword(password)) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Actualizar perfil si se proporciona displayName
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      
      // Enviar verificación de email
      await sendEmailVerification(result.user);
      
      console.log('Usuario registrado exitosamente:', result.user.email);
      return result;

    } catch (error: any) {
      console.error('Error en registro:', error);
      throw this.manejarErrorAuth(error);
    }
  }

  /**
   * INICIAR SESIÓN
   */
  async login(email: string, password: string): Promise<UserCredential> {
    try {
      // Validaciones básicas
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }

      if (!this.validarEmail(email)) {
        throw new Error('El formato del email no es válido');
      }

      const result = await signInWithEmailAndPassword(this.auth, email, password);
      
      console.log('Login exitoso:', result.user.email);
      return result;

    } catch (error: any) {
      console.error('Error en login:', error);
      throw this.manejarErrorAuth(error);
    }
  }

  /**
   * CERRAR SESIÓN
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      
      // Limpiar datos locales
      this.userData = null;
      this.userState.next(null);
      localStorage.removeItem('user');
      
      // Redirigir al login
      this.ngZone.run(() => {
        this.router.navigate(['/login']);
      });
      
      console.log('Sesión cerrada exitosamente');

    } catch (error: any) {
      console.error('Error en logout:', error);
      throw this.manejarErrorAuth(error);
    }
  }

  /**
   * OBTENER USUARIO ACTUAL (Promise)
   */
  getCurrentUser(): Promise<UserWithRole | null> {
    return new Promise((resolve) => {
      // Si ya tenemos los datos, devolverlos inmediatamente
      if (this.userData) {
        resolve(this.userData);
        return;
      }

      // Si no, esperar al estado de autenticación
      const unsubscribe = onAuthStateChanged(this.auth, (user: User | null) => {
        unsubscribe(); // Limpiar subscription
        if (user) {
          const userWithRole: UserWithRole = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            role: this.isAdminUser(user.email) ? 'admin' : 'user'
          };
          resolve(userWithRole);
        } else {
          resolve(null);
        }
      });
    });
  }

  /**
   * VERIFICAR SI EL USUARIO ESTÁ AUTENTICADO
   */
  isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    return user !== null && user !== 'null';
  }

  /**
   * OBTENER DATOS DEL USUARIO DESDE LOCALSTORAGE
   */
  getUserData(): UserWithRole | null {
    try {
      const user = localStorage.getItem('user');
      if (user && user !== 'null') {
        return JSON.parse(user);
      }
      return null;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      return null;
    }
  }

  /**
   * OBTENER ROL DEL USUARIO ACTUAL
   */
  getCurrentUserRole(): 'admin' | 'user' | null {
    const userData = this.getUserData();
    return userData?.role || null;
  }

  /**
   * VERIFICAR SI EL USUARIO ES ADMINISTRADOR
   */
  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'admin';
  }

  /**
   * RECUPERAR CONTRASEÑA
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      if (!this.validarEmail(email)) {
        throw new Error('El formato del email no es válido');
      }

      await sendPasswordResetEmail(this.auth, email);
      console.log('Email de recuperación enviado a:', email);

    } catch (error: any) {
      console.error('Error en recuperación de contraseña:', error);
      throw this.manejarErrorAuth(error);
    }
  }

  /**
   * ACTUALIZAR PERFIL DE USUARIO
   */
  async updateUserProfile(displayName: string, photoURL: string = ''): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      await updateProfile(user, { displayName, photoURL });
      console.log('Perfil actualizado exitosamente');

      // Actualizar datos locales
      this.actualizarDatosLocales();

    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      throw this.manejarErrorAuth(error);
    }
  }

  /**
   * ACTUALIZAR EMAIL
   */
  async updateUserEmail(newEmail: string): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      if (!this.validarEmail(newEmail)) {
        throw new Error('El formato del email no es válido');
      }

      await updateEmail(user, newEmail);
      console.log('Email actualizado exitosamente');

      // Actualizar datos locales
      this.actualizarDatosLocales();

    } catch (error: any) {
      console.error('Error al actualizar email:', error);
      throw this.manejarErrorAuth(error);
    }
  }

  /**
   * ACTUALIZAR CONTRASEÑA
   */
  async updateUserPassword(newPassword: string): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      if (!this.validarPassword(newPassword)) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      await updatePassword(user, newPassword);
      console.log('Contraseña actualizada exitosamente');

    } catch (error: any) {
      console.error('Error al actualizar contraseña:', error);
      throw this.manejarErrorAuth(error);
    }
  }

  /**
   * REENVIAR VERIFICACIÓN DE EMAIL
   */
  async resendEmailVerification(): Promise<void> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      await sendEmailVerification(user);
      console.log('Email de verificación reenviado');

    } catch (error: any) {
      console.error('Error al reenviar verificación:', error);
      throw this.manejarErrorAuth(error);
    }
  }

  /**
   * OBTENER LISTA DE ADMINISTRADORES (solo lectura)
   */
  getAdminEmails(): string[] {
    return [...this.ADMIN_EMAILS];
  }

  /**
   * AGREGAR EMAIL A LA LISTA DE ADMINISTRADORES (en tiempo de ejecución)
   */
  addAdminEmail(email: string): void {
    const emailNormalizado = email.toLowerCase();
    if (!this.ADMIN_EMAILS.includes(emailNormalizado)) {
      this.ADMIN_EMAILS.push(emailNormalizado);
      console.log('Email agregado a administradores:', emailNormalizado);
      
      // Actualizar rol del usuario actual si corresponde
      this.actualizarRolUsuarioActual();
    }
  }

  /**
   * VALIDAR FORMATO DE EMAIL
   */
  private validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * VALIDAR CONTRASEÑA
   */
  private validarPassword(password: string): boolean {
    return password.length >= 6;
  }

  /**
   * MANEJAR ERRORES DE FIREBASE AUTH
   */
  private manejarErrorAuth(error: any): Error {
    console.error('Código de error Firebase:', error.code);
    
    switch (error.code) {
      case 'auth/invalid-email':
        return new Error('El formato del email no es válido.');
      case 'auth/user-disabled':
        return new Error('Esta cuenta ha sido deshabilitada.');
      case 'auth/user-not-found':
        return new Error('No existe una cuenta con este email.');
      case 'auth/wrong-password':
        return new Error('La contraseña es incorrecta.');
      case 'auth/email-already-in-use':
        return new Error('Ya existe una cuenta con este email.');
      case 'auth/weak-password':
        return new Error('La contraseña es demasiado débil.');
      case 'auth/too-many-requests':
        return new Error('Demasiados intentos fallidos. Intenta más tarde.');
      case 'auth/network-request-failed':
        return new Error('Error de conexión. Verifica tu internet.');
      case 'auth/requires-recent-login':
        return new Error('Esta operación requiere que inicies sesión nuevamente.');
      case 'auth/operation-not-allowed':
        return new Error('Esta operación no está permitida.');
      default:
        return new Error(error.message || 'Ocurrió un error inesperado.');
    }
  }

  /**
   * ACTUALIZAR DATOS LOCALES DEL USUARIO
   */
  private actualizarDatosLocales(): void {
    const user = this.auth.currentUser;
    if (user && this.userData) {
      this.userData.displayName = user.displayName;
      this.userData.photoURL = user.photoURL;
      this.userData.email = user.email;
      this.userData.emailVerified = user.emailVerified;
      this.userData.role = this.isAdminUser(user.email) ? 'admin' : 'user';
      
      this.userState.next(this.userData);
      localStorage.setItem('user', JSON.stringify(this.userData));
    }
  }

  /**
   * ACTUALIZAR ROL DEL USUARIO ACTUAL
   */
  private actualizarRolUsuarioActual(): void {
    const user = this.auth.currentUser;
    if (user && this.userData) {
      const nuevoRol = this.isAdminUser(user.email) ? 'admin' : 'user';
      if (this.userData.role !== nuevoRol) {
        this.userData.role = nuevoRol;
        this.userState.next(this.userData);
        localStorage.setItem('user', JSON.stringify(this.userData));
        console.log('Rol del usuario actualizado a:', nuevoRol);
      }
    }
  }

  /**
   * LIMPIAR DATOS DE AUTENTICACIÓN (para testing)
   */
  clearAuthData(): void {
    this.userData = null;
    this.userState.next(null);
    localStorage.removeItem('user');
  }

  /**
   * VERIFICAR SI EL EMAIL ESTÁ VERIFICADO
   */
  isEmailVerified(): boolean {
    return this.userData?.emailVerified || false;
  }

  /**
   * OBTENER INFORMACIÓN DEL USUARIO PARA DEBUG
   */
  getDebugInfo(): any {
    return {
      currentUser: this.userData,
      isLoggedIn: this.isLoggedIn(),
      isAdmin: this.isAdmin(),
      adminEmails: this.ADMIN_EMAILS,
      localStorageUser: localStorage.getItem('user')
    };
  }
}