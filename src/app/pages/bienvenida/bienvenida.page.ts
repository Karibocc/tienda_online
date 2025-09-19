import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.page.html',
  styleUrls: ['./bienvenida.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class BienvenidaPage {
  email: string = '';

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    // ✅ Recuperamos el correo desde localStorage
    this.email = localStorage.getItem('usuarioEmail') || 'Usuario';
  }

  cerrarSesion() {
    // ✅ Eliminamos sesión
    localStorage.removeItem('usuarioEmail');
    this.navCtrl.navigateRoot('/login');
    console.log('Sesión cerrada correctamente 🚪');
  }
}


