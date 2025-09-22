import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { CarritoService, Producto } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule]
})
export class CatalogoPage {
  productos: Producto[] = [
    { id: 1, nombre: 'Refrigerador LG 300L', precio: 2500000, imagen: 'assets/refrigerador.jpg' },
    { id: 2, nombre: 'Lavadora Samsung 20kg', precio: 1800000, imagen: 'assets/lavadora.jpg' },
    { id: 3, nombre: 'Microondas Haceb', precio: 450000, imagen: 'assets/microondas.jpg' },
    { id: 4, nombre: 'Televisor 50" Smart TV', precio: 2200000, imagen: 'assets/televisor.jpg' },
    { id: 5, nombre: 'Plancha Oster Vapor', precio: 150000, imagen: 'assets/plancha.jpg' }
  ];

  constructor(private carritoService: CarritoService, private toastController: ToastController) {}

  agregarAlCarrito(producto: Producto) {
    this.carritoService.agregarProducto(producto);
    this.mostrarToast(producto);
    console.log('Producto agregado:', producto.nombre);
  }

  async mostrarToast(producto: Producto) {
    const toast = await this.toastController.create({
      message: `Añadido al carrito: ${producto.nombre} (Cantidad: ${producto.cantidad})`,
      duration: 1500,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }
}
