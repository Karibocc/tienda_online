import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-admin-footer',
  templateUrl: './admin-footer.component.html',
  styleUrls: ['./admin-footer.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class AdminFooterComponent {
  
  abrirGithub() {
    // 🔹 Reemplaza con el URL real de tu repositorio GitHub
    const githubUrl = 'https://github.com/Karibocc/tienda_online';
    window.open(githubUrl, '_blank');
  }

}