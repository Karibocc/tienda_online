import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-acceso-denegado',
  templateUrl: './acceso-denegado.page.html',
  styleUrls: ['./acceso-denegado.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule]
})
export class AccesoDenegadoPage {
  constructor() {}
}