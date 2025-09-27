export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen?: string; // ← Nueva propiedad para la imagen
  imagenFile?: File; // ← Para el archivo temporal
  fechaCreacion?: Date;
}