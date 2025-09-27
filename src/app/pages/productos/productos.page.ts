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
    setTimeout(() => {
      this.productos = this.productosService.obtenerProductos();
      this.cargando = false;
    }, 500);
  }

  eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const eliminado = this.productosService.eliminarProducto(id);
      if (eliminado) {
        this.cargarProductos();
      }
    }
  }

  formatearFecha(fecha: Date | undefined): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  calcularPrecioPromedio(): number {
    if (this.productos.length === 0) return 0;
    const total = this.productos.reduce((sum, producto) => sum + producto.precio, 0);
    return total / this.productos.length;
  }

  obtenerProductoMasCaro(): Producto | null {
    if (this.productos.length === 0) return null;
    return this.productos.reduce((max, producto) => 
      producto.precio > max.precio ? producto : max
    );
  }
}