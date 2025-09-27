import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
 
// Páginas standalone
import { LoginPage } from './pages/login/login.page';
import { RegistroPage } from './pages/registro/registro.page';
import { BienvenidaPage } from './pages/bienvenida/bienvenida.page';
 
const routes: Routes = [
  // 🔹 Ruta por defecto
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // 🔹 Rutas públicas
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then(m => m.RegistroPage),
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./pages/catalogo/catalogo.page').then(m => m.CatalogoPage),
  },
  {
    path: 'carrito',
    loadComponent: () => import('./pages/carrito/carrito.page').then(m => m.CarritoPage),
  },

  // 🔹 Rutas protegidas (requieren autenticación)
  {
    path: 'bienvenida',
    loadComponent: () => import('./pages/bienvenida/bienvenida.page').then(m => m.BienvenidaPage),
    canActivate: [AuthGuard],
  },

  // 🔹 Rutas de administrador (requieren rol admin)
  {
    path: 'productos',
    loadComponent: () => import('./pages/productos/productos.page').then(m => m.ProductosPage),
    canActivate: [AdminGuard],
  },
  {
    path: 'productos/nuevo',
    loadComponent: () => import('./pages/producto-form/producto-form.page').then(m => m.ProductoFormPage),
    canActivate: [AdminGuard],
  },
  {
    path: 'productos/editar/:id',
    loadComponent: () => import('./pages/producto-form/producto-form.page').then(m => m.ProductoFormPage),
    canActivate: [AdminGuard],
  },

  // 🔹 Página de acceso denegado
  {
    path: 'acceso-denegado',
    loadComponent: () => import('./pages/acceso-denegado/acceso-denegado.page').then(m => m.AccesoDenegadoPage),
  },

  // 🔹 Ruta comodín
  { path: '**', redirectTo: 'login' },
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}