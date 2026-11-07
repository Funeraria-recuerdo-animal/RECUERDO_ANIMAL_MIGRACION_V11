import type { Producto } from './cart';

export type Categoria = { id: number; nombre: string };
export const normalizarNombre = (nombre: string): string => nombre.trim().replace(/\s+/g, ' ');
export function categoriaDuplicada(categorias: Categoria[], nombre: string, exceptoId?: number): boolean {
  const buscado = normalizarNombre(nombre).toLocaleLowerCase('es');
  return categorias.some(c => c.id !== exceptoId && normalizarNombre(c.nombre).toLocaleLowerCase('es') === buscado);
}
export function productosDeCategoria(productos: Producto[], nombre: string): Producto[] {
  return productos.filter(p => p.categoria === nombre);
}
export function validarCategoria(categorias: Categoria[], nombre: string, exceptoId?: number): string {
  if (!normalizarNombre(nombre)) return 'Ingresa el nombre de la categoría.';
  if (categoriaDuplicada(categorias, nombre, exceptoId)) return 'Ya existe una categoría con ese nombre.';
  return '';
}
