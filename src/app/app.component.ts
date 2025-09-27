import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NavController } from '@ionic/angular';
 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private platform: Platform, private navCtrl: NavController) {
    this.initializeApp();
  }
 
  initializeApp() {
    this.platform.ready().then(() => {
      // 🔹 Modo pruebas: saltar login y abrir catálogo directamente
      const modoPruebas = true;
 
      if (modoPruebas) {
        this.navCtrl.navigateRoot('/productos');
      } else {
        this.navCtrl.navigateRoot('/login');
      }
    });
  }
}