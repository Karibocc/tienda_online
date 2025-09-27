import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class ProductosPage implements OnInit {
  productos: Producto[] = [];
  cargando: boolean = true;

  constructor(private productosService: ProductosService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.cargando = true;
    // Pequeño delay para simular carga (opcional)
    setTimeout(() => {
      this.productos = this.productosService.obtenerProductos();
      this.cargando = false;
      console.log('Productos cargados:', this.productos);
    }, 300);
  }

  eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const eliminado = this.productosService.eliminarProducto(id);
      if (eliminado) {
        this.cargarProductos(); // Recargar la lista
      }
    }
  }

  // Método para formatear fecha
  formatearFecha(fecha: Date | undefined): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES');
  }
}