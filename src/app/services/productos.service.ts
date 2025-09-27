import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private productos: Producto[] = [];
  private readonly STORAGE_KEY = 'productos_data';
  private nextId = 1;

  constructor() {
    this.cargarDesdeLocalStorage();
    // Si no hay datos, agregar ejemplos
    if (this.productos.length === 0) {
      this.agregarProductosEjemplo();
    }
  }

  private cargarDesdeLocalStorage() {
    const datosGuardados = localStorage.getItem(this.STORAGE_KEY);
    if (datosGuardados) {
      this.productos = JSON.parse(datosGuardados);
      // Encontrar el máximo ID para nextId
      if (this.productos.length > 0) {
        this.nextId = Math.max(...this.productos.map(p => p.id || 0)) + 1;
      }
    }
  }

  private guardarEnLocalStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.productos));
  }

  private agregarProductosEjemplo() {
    this.agregarProducto({
      nombre: 'Laptop HP',
      precio: 1200.99,
      descripcion: 'Laptop HP con 8GB RAM y 512GB SSD'
    });
    
    this.agregarProducto({
      nombre: 'Mouse Inalámbrico',
      precio: 25.50,
      descripcion: 'Mouse ergonómico inalámbrico'
    });
    
    this.agregarProducto({
      nombre: 'Teclado Mecánico',
      precio: 89.99,
      descripcion: 'Teclado mecánico RGB'
    });
  }

  obtenerProductos(): Producto[] {
    return [...this.productos].sort((a, b) => (a.id || 0) - (b.id || 0));
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
    this.guardarEnLocalStorage();
    console.log('Producto agregado:', nuevoProducto);
  }

  actualizarProducto(id: number, producto: Producto): boolean {
    const index = this.productos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.productos[index] = { 
        ...producto, 
        id,
        fechaCreacion: this.productos[index].fechaCreacion // Mantener fecha original
      };
      this.guardarEnLocalStorage();
      console.log('Producto actualizado:', this.productos[index]);
      return true;
    }
    return false;
  }

  eliminarProducto(id: number): boolean {
    const index = this.productos.findIndex(p => p.id === id);
    if (index !== -1) {
      const productoEliminado = this.productos.splice(index, 1)[0];
      this.guardarEnLocalStorage();
      console.log('Producto eliminado:', productoEliminado);
      return true;
    }
    return false;
  }

  // Método adicional para limpiar todos los datos (útil para testing)
  limpiarDatos(): void {
    this.productos = [];
    this.nextId = 1;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Método para obtener estadísticas
  obtenerEstadisticas() {
    return {
      totalProductos: this.productos.length,
      precioPromedio: this.productos.length > 0 
        ? this.productos.reduce((sum, p) => sum + p.precio, 0) / this.productos.length 
        : 0,
      productoMasCaro: this.productos.length > 0 
        ? this.productos.reduce((max, p) => p.precio > max.precio ? p : max) 
        : null
    };
  }
}