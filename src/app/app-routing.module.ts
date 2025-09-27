import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
 
// Páginas standalone
import { LoginPage } from './pages/login/login.page';
import { RegistroPage } from './pages/registro/registro.page';
import { BienvenidaPage } from './pages/bienvenida/bienvenida.page';
 
const routes: Routes = [
  // 🔹 Ruta por defecto para pruebas: abrir directamente página de productos
  {
    path: '',
    redirectTo: 'productos', // Aquí ponemos la página de productos del administrador
    pathMatch: 'full',
  },
 
  // Login
  {
    path: 'login',
    component: LoginPage,
  },
 
  // Registro
  {
    path: 'registro',
    component: RegistroPage,
  },
 
  // Bienvenida (AuthGuard temporalmente ignorado para pruebas)
  {
    path: 'bienvenida',
    component: BienvenidaPage,
    // canActivate: [AuthGuard], // 🔹 Comentado para pruebas
  },
 
  // Catálogo (AuthGuard ignorado para pruebas)
  {
    path: 'catalogo',
    loadComponent: () => import('./pages/catalogo/catalogo.page').then(m => m.CatalogoPage),
    // canActivate: [AuthGuard], // 🔹 Comentado para pruebas
  },
 
  // Tabs (AuthGuard ignorado)
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    // canActivate: [AuthGuard], // 🔹 Comentado para pruebas
  },
 
  // Página de productos del administrador (sin AuthGuard)
  {
    path: 'productos',
    loadComponent: () => import('./pages/productos/productos.page').then(m => m.ProductosPage),
  },
 {
    path: 'productos/nuevo',  // ← Esta ruta debe existir
    loadComponent: () => import('./pages/producto-form/producto-form.page').then(m => m.ProductoFormPage)
  },
  // Ruta comodín (opcionalmente comentada para pruebas)
  // { path: '**', redirectTo: 'login' },
];
 
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}