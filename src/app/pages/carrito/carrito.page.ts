import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { RouterModule } from '@angular/router'; // ← Agregar esta importación
import { CarritoService, ProductoCarrito } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule] // ← Agregar RouterModule aquí
})
export class CarritoPage implements OnInit {
  items: ProductoCarrito[] = [];

  constructor(
    public carritoService: CarritoService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarItems();
  }

  cargarItems() {
    this.items = this.carritoService.obtenerItems();
  }

  incrementarCantidad(item: ProductoCarrito) {
    this.carritoService.actualizarCantidad(item.id, item.cantidad + 1);
    this.cargarItems();
  }

  decrementarCantidad(item: ProductoCarrito) {
    if (item.cantidad > 1) {
      this.carritoService.actualizarCantidad(item.id, item.cantidad - 1);
    } else {
      this.eliminarProducto(item.id);
    }
    this.cargarItems();
  }

  async eliminarProducto(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres eliminar este producto del carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.carritoService.eliminarProducto(id);
            this.cargarItems();
          }
        }
      ]
    });
    await alert.present();
  }

  async vaciarCarrito() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres vaciar todo el carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Vaciar',
          handler: () => {
            this.carritoService.vaciarCarrito();
            this.cargarItems();
          }
        }
      ]
    });
    await alert.present();
  }

  calcularSubtotal(item: ProductoCarrito): number {
    return item.precio * item.cantidad;
  }
}