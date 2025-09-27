import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { Producto } from '../../models/producto.model';
import { AdminHeaderComponent } from '../../admin-header/admin-header.component'; // ← Nuevo
import { AdminFooterComponent } from '../../admin-footer/admin-footer.component'; // ← Nuevo

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.page.html',
  styleUrls: ['./producto-form.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, AdminHeaderComponent, // ← Agregar
      AdminFooterComponent ]
})
export class ProductoFormPage implements OnInit {
  producto: Producto = {
    nombre: '',
    precio: 0,
    descripcion: '',
    imagen: ''
  };

  imagenPrevia: string | ArrayBuffer | null = null;
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
        this.imagenPrevia = this.producto.imagen || null;
      }
    }
  }

  onImagenSeleccionada(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      // Validar tipo de archivo
      if (!archivo.type.startsWith('image/')) {
        alert('Por favor selecciona una imagen válida');
        return;
      }

      // Validar tamaño (max 2MB)
      if (archivo.size > 2 * 1024 * 1024) {
        alert('La imagen no debe superar los 2MB');
        return;
      }

      this.producto.imagenFile = archivo;

      // Crear vista previa
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPrevia = e.target?.result || null;
      };
      reader.readAsDataURL(archivo);
    }
  }

  eliminarImagen() {
    this.producto.imagen = '';
    this.producto.imagenFile = undefined;
    this.imagenPrevia = null;
  }

  async guardarProducto() {
    if (!this.producto.nombre || this.producto.nombre.trim() === '') {
      alert('El nombre del producto es requerido');
      return;
    }

    if (this.producto.precio < 0) {
      alert('El precio no puede ser negativo');
      return;
    }

    try {
      if (this.isEdit && this.productoId) {
        await this.productosService.actualizarProducto(this.productoId, this.producto);
        alert('Producto actualizado correctamente');
      } else {
        await this.productosService.agregarProducto(this.producto);
        alert('Producto creado correctamente');
      }
      
      this.router.navigate(['/productos']);
    } catch (error) {
      alert('Error al guardar el producto');
      console.error(error);
    }
  }

  cancelar() {
    this.router.navigate(['/productos']);
  }

  limpiarFormulario() {
    this.producto = {
      nombre: '',
      precio: 0,
      descripcion: '',
      imagen: ''
    };
    this.imagenPrevia = null;
  }
}