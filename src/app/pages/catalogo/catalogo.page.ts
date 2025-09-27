import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { CarritoService, ProductoCarrito } from 'src/app/services/carrito.service';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from 'src/app/models/producto.model';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class CatalogoPage implements OnInit {
  productos: Producto[] = [];
  cargando: boolean = true;

  constructor(
    public carritoService: CarritoService, // ← Cambiar a public para usar en HTML
    private productosService: ProductosService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.cargando = true;
    setTimeout(() => {
      this.productos = this.productosService.obtenerProductos();
      this.cargando = false;
    }, 300);
  }

  agregarAlCarrito(producto: Producto) {
    const productoCarrito: ProductoCarrito = {
      id: producto.id!,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen || 'assets/images/placeholder.jpg',
      cantidad: 1
    };
    
    this.carritoService.agregarProducto(productoCarrito);
    this.mostrarToast(producto);
  }

  async mostrarToast(producto: Producto) {
    const toast = await this.toastController.create({
      message: `✅ ${producto.nombre} añadido al carrito`,
      duration: 2000,
      position: 'bottom',
      color: 'success',
      buttons: [
        {
          text: 'Ver Carrito',
          handler: () => {
            // Navegar al carrito si es necesario
          }
        }
      ]
    });
    toast.present();
  }
}