import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'catalogo',
        loadComponent: () => import('../catalogo/catalogo.page').then(m => m.CatalogoPage)
      },
      {
        path: 'carrito',
        loadComponent: () => import('../carrito/carrito.page').then(m => m.CarritoPage)
      },
      {
        path: '',
        redirectTo: 'catalogo',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
