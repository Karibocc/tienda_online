import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TabsPage, // ✅ Componente standalone importado
    RouterModule.forChild([{ path: '', component: TabsPage }])
  ],
  declarations: [] // ✅ Quitamos TabsPage de declarations
})
export class TabsPageModule {}

