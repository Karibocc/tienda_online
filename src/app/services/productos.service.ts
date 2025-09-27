import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private productos: Producto[] = [];
  
  private nextId = 1;

  constructor() {
    // Datos de ejemplo
    this.agregarProducto({
      nombre: 'Producto Ejemplo 1',
      precio: 29.99,
      descripcion: 'Descripción del producto 1'
    });
    
    this.agregarProducto({
      nombre: 'Producto Ejemplo 2',
      precio: 39.99,
      descripcion: 'Descripción del producto 2'
    });
  }

  obtenerProductos(): Producto[] {
    return [...this.productos];
  }

  obtenerProductoPorId(id: number): Producto | undefined {
    return this.productos.find(p => p.id === id);
  }

  agregarProducto(producto: Producto): void {
    const nuevoProducto: Producto = {
      ...producto,
      id: this.nextId++,
      fechaCreacion: new Date()
    };
    this.productos.push(nuevoProducto);
  }

  actualizarProducto(id: number, producto: Producto): boolean {
    const index = this.productos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.productos[index] = { ...producto, id };
      return true;
    }
    return false;
  }

  eliminarProducto(id: number): boolean {
    const index = this.productos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.productos.splice(index, 1);
      return true;
    }
    return false;
  }
}