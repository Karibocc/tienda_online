import { Injectable } from '@angular/core';

export interface ProductoCarrito {
  id: number;
  nombre: string;
  precio: number;
  imagen?: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  // Definir la propiedad items que falta
  private items: ProductoCarrito[] = [];

  constructor() {
    this.cargarCarritoDesdeLocalStorage();
  }

  // Cargar carrito desde localStorage
 private cargarCarritoDesdeLocalStorage() {
    try {
      const carritoGuardado = localStorage.getItem('carrito_data');
      if (carritoGuardado) {
        this.items = JSON.parse(carritoGuardado);
      }
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      this.items = [];
    }
  }

  // Guardar carrito en localStorage
  private guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito_data', JSON.stringify(this.items));
  }

  // Agregar producto al carrito
  agregarProducto(producto: ProductoCarrito) {
    const productoExistente = this.items.find(item => item.id === producto.id);
    
    if (productoExistente) {
      // Si ya existe, incrementar cantidad
      productoExistente.cantidad += producto.cantidad;
    } else {
      // Si no existe, agregar nuevo producto
      this.items.push({ ...producto });
    }
    
    this.guardarCarritoEnLocalStorage();
  }

  // Eliminar producto del carrito
  eliminarProducto(id: number) {
    this.items = this.items.filter(item => item.id !== id);
    this.guardarCarritoEnLocalStorage();
  }

  // Actualizar cantidad de un producto
  actualizarCantidad(id: number, cantidad: number) {
    const producto = this.items.find(item => item.id === id);
    if (producto) {
      producto.cantidad = cantidad;
      if (producto.cantidad <= 0) {
        this.eliminarProducto(id);
      } else {
        this.guardarCarritoEnLocalStorage();
      }
    }
  }

  // Obtener todos los items del carrito
  obtenerItems(): ProductoCarrito[] {
    return [...this.items];
  }

  // Obtener cantidad total de productos
  obtenerCantidadTotal(): number {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  // Calcular total del carrito
  calcularTotal(): number {
    return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  // Vaciar el carrito
  vaciarCarrito() {
    this.items = [];
    this.guardarCarritoEnLocalStorage();
  }

  // Obtener un producto específico
  obtenerProducto(id: number): ProductoCarrito | undefined {
    return this.items.find(item => item.id === id);
  }

  // Verificar si el carrito está vacío
  estaVacio(): boolean {
    return this.items.length === 0;
  }

  // Obtener número de productos únicos
  obtenerNumeroProductos(): number {
    return this.items.length;
  }
}