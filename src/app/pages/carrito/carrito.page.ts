import { Component } from '@angular/core';
import { IonicModule, ToastController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CarritoService, Producto } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CarritoPage {
  productos: Producto[] = [];

  constructor(
    private carritoService: CarritoService, 
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.productos = this.carritoService.obtenerProductos();
  }

  aumentarCantidad(producto: Producto) {
    this.carritoService.aumentarCantidad(producto);
  }

  disminuirCantidad(producto: Producto) {
    this.carritoService.disminuirCantidad(producto);
    this.productos = this.carritoService.obtenerProductos();
  }

  eliminarProducto(producto: Producto) {
    this.carritoService.eliminarProducto(producto.id);
    this.productos = this.carritoService.obtenerProductos();
  }

  vaciarCarrito() {
    this.carritoService.vaciarCarrito();
    this.productos = this.carritoService.obtenerProductos();
  }

  obtenerTotal(): number {
    return this.carritoService.obtenerTotal();
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 1500,
      position: 'bottom'
    });
    await toast.present();
  }

  async pagar() {
    const alert = await this.alertCtrl.create({
      header: 'Seleccione un método de pago',
      buttons: [
        {
          text: 'Tarjeta',
          handler: () => this.mostrarToast('Método de pago: Tarjeta seleccionado')
        },
        {
          text: 'Efectivo',
          handler: () => this.mostrarToast('Método de pago: Efectivo seleccionado')
        },
        {
          text: 'PayPal',
          handler: () => this.mostrarToast('Método de pago: PayPal seleccionado')
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }
}
