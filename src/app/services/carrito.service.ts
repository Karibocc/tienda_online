import { Injectable } from '@angular/core';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad?: number; // cantidad es opcional aquí
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private productos: Producto[] = [];

  constructor() {}

  agregarProducto(producto: Producto) {
    const existe = this.productos.find(p => p.id === producto.id);
    if (existe) {
      // si ya existe, aumentamos la cantidad
      existe.cantidad! += 1;
    } else {
      // si no existe, inicializamos cantidad en 1
      this.productos.push({ ...producto, cantidad: 1 });
    }
  }

  obtenerProductos(): Producto[] {
    return this.productos;
  }

  eliminarProducto(id: number) {
    this.productos = this.productos.filter(p => p.id !== id);
  }

  vaciarCarrito() {
    this.productos = [];
  }

  aumentarCantidad(producto: Producto) {
    producto.cantidad! += 1;
  }

  disminuirCantidad(producto: Producto) {
    if (producto.cantidad! > 1) {
      producto.cantidad! -= 1;
    } else {
      this.eliminarProducto(producto.id);
    }
  }

  obtenerTotal(): number {
    return this.productos.reduce((acc, prod) => acc + prod.precio * (prod.cantidad ?? 0), 0);
  }
}
