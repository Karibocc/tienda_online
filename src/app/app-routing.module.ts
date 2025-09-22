import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Guard para proteger rutas

// Páginas standalone
import { LoginPage } from './pages/login/login.page';
import { RegistroPage } from './pages/registro/registro.page';
import { BienvenidaPage } from './pages/bienvenida/bienvenida.page';

const routes: Routes = [
  // Redirección inicial: si entra a la raíz, va a login
  {
    path: '',
    redirectTo: 'login',
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
  // Página de bienvenida
  {
    path: 'bienvenida',
    component: BienvenidaPage,
    canActivate: [AuthGuard], // Solo accesible si está logueado
  },
  // Catálogo
  {
    path: 'catalogo',
    loadComponent: () => import('./pages/catalogo/catalogo.page').then(m => m.CatalogoPage),
    canActivate: [AuthGuard], // Protegemos para que solo usuarios logueados vean catálogo
  },
  // Tabs (carrito y otras secciones)
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard], // Protegemos rutas internas
  },
  // Wildcard: cualquier ruta no encontrada va al catálogo (o login)
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
