import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.page.html',
  styleUrls: ['./producto-form.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class ProductoFormPage implements OnInit {
  producto: Producto = {
    nombre: '',
    precio: 0,
    descripcion: ''
  };

  isEdit = false;
  productoId?: number;

  constructor(
    private productosService: ProductosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    
    if (this.productoId) {
      this.isEdit = true;
      const productoExistente = this.productosService.obtenerProductoPorId(this.productoId);
      if (productoExistente) {
        this.producto = { ...productoExistente };
      }
    }
  }

  guardarProducto() {
    if (!this.producto.nombre || this.producto.nombre.trim() === '') {
      alert('El nombre del producto es requerido');
      return;
    }

    if (this.producto.precio < 0) {
      alert('El precio no puede ser negativo');
      return;
    }

    if (this.isEdit && this.productoId) {
      this.productosService.actualizarProducto(this.productoId, this.producto);
      alert('Producto actualizado correctamente');
    } else {
      this.productosService.agregarProducto(this.producto);
      alert('Producto creado correctamente');
    }
    
    this.router.navigate(['/productos']);
  }

  cancelar() {
    this.router.navigate(['/productos']);
  }

  limpiarFormulario() {
    this.producto = {
      nombre: '',
      precio: 0,
      descripcion: ''
    };
  }
}