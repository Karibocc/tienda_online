import { Injectable } from '@angular/core';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private productos: Producto[] = [];
  private readonly STORAGE_KEY = 'productos_data';
  private readonly IMAGES_KEY = 'productos_imagenes_';
  private nextId = 1;

  constructor() {
    this.cargarDesdeLocalStorage();
    if (this.productos.length === 0) {
      this.agregarProductosEjemplo();
    }
  }

  private cargarDesdeLocalStorage() {
    const datosGuardados = localStorage.getItem(this.STORAGE_KEY);
    if (datosGuardados) {
      this.productos = JSON.parse(datosGuardados);
      if (this.productos.length > 0) {
        this.nextId = Math.max(...this.productos.map((p) => p.id || 0)) + 1;
      }
    }
  }

  private guardarEnLocalStorage() {
    // Guardar solo datos, no archivos
    const productosParaGuardar = this.productos.map((p) => ({
      ...p,
      imagenFile: undefined, // No guardar el archivo en localStorage
    }));
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(productosParaGuardar)
    );
  }

  // Convertir imagen a Base64 para guardarla
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  // Guardar imagen en localStorage
  private guardarImagen(productoId: number, base64Image: string) {
    localStorage.setItem(`${this.IMAGES_KEY}${productoId}`, base64Image);
  }

  // Obtener imagen desde localStorage
  obtenerImagen(productoId: number): string | null {
    return localStorage.getItem(`${this.IMAGES_KEY}${productoId}`);
  }

  private agregarProductosEjemplo() {
    this.agregarProducto({
      nombre: 'Laptop HP',
      precio: 1200.99,
      descripcion: 'Laptop HP con 8GB RAM y 512GB SSD',
      imagen: 'assets/images/laptop.jpg', // Imagen por defecto
    });

    this.agregarProducto({
      nombre: 'Mouse Inalámbrico',
      precio: 25.5,
      descripcion: 'Mouse ergonómico inalámbrico',
      imagen: 'assets/images/mouse.jpg',
    });
  }

  async agregarProducto(producto: Producto): Promise<void> {
    let imagenBase64 = producto.imagen;

    // Si hay un archivo de imagen, convertirlo a Base64
    if (producto.imagenFile) {
      imagenBase64 = await this.fileToBase64(producto.imagenFile);
    }

    const nuevoProducto: Producto = {
      ...producto,
      id: this.nextId++,
      imagen: imagenBase64,
      fechaCreacion: new Date(),
    };

    this.productos.push(nuevoProducto);

    // Guardar imagen por separado si existe
    if (imagenBase64 && producto.imagenFile) {
      this.guardarImagen(nuevoProducto.id!, imagenBase64);
    }

    this.guardarEnLocalStorage();
  }

  async actualizarProducto(id: number, producto: Producto): Promise<boolean> {
    const index = this.productos.findIndex((p) => p.id === id);
    if (index !== -1) {
      let imagenBase64 = producto.imagen;

      // Si hay un nuevo archivo de imagen, convertirlo
      if (producto.imagenFile) {
        imagenBase64 = await this.fileToBase64(producto.imagenFile);
      }

      this.productos[index] = {
        ...producto,
        id,
        imagen: imagenBase64,
        fechaCreacion: this.productos[index].fechaCreacion,
      };

      // Guardar nueva imagen si existe
      if (imagenBase64 && producto.imagenFile) {
        this.guardarImagen(id, imagenBase64);
      }

      this.guardarEnLocalStorage();
      return true;
    }
    return false;
  }

  // Los demás métodos permanecen igual...
  obtenerProductos(): Producto[] {
    return [...this.productos].sort((a, b) => (a.id || 0) - (b.id || 0));
  }

  obtenerProductoPorId(id: number): Producto | undefined {
    const producto = this.productos.find((p) => p.id === id);
    if (producto) {
      // Cargar imagen desde localStorage si no está en el objeto
      if (!producto.imagen) {
        const imagenGuardada = this.obtenerImagen(id);
        if (imagenGuardada) {
          producto.imagen = imagenGuardada; // Solo asignar si no es null
        }
      }
    }
    return producto;
  }

  eliminarProducto(id: number): boolean {
    const index = this.productos.findIndex((p) => p.id === id);
    if (index !== -1) {
      // Eliminar también la imagen
      localStorage.removeItem(`${this.IMAGES_KEY}${id}`);
      this.productos.splice(index, 1);
      this.guardarEnLocalStorage();
      return true;
    }
    return false;
  }
}
