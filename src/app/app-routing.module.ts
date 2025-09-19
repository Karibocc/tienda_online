import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // ✅ importamos el guard

// 👇 Importamos las páginas standalone
import { LoginPage } from './pages/login/login.page';
import { RegistroPage } from './pages/registro/registro.page';
import { BienvenidaPage } from './pages/bienvenida/bienvenida.page'; // ✅ nueva página importada

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // ✅ la app inicia en login
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule), // 👈 Ajuste: debe ir en /pages/tabs, no dentro de login
    canActivate: [AuthGuard], // ✅ protegemos esta ruta
  },
  {
    path: 'registro',
    component: RegistroPage,
  },
  {
    path: 'bienvenida', // ✅ nueva ruta de bienvenida
    component: BienvenidaPage,
  },
  {
    path: '**', // ✅ ruta wildcard para no encontrados
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}






