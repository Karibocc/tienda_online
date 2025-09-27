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

  constructor(private productosService: ProductosService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productos = this.productosService.obtenerProductos();
  }

  eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productosService.eliminarProducto(id);
      this.cargarProductos();
    }
  }
}