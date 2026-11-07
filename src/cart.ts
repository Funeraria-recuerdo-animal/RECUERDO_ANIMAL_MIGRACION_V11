export type Item = { id: number; cantidad: number };
export type Producto = { id: number; nombre: string; categoria: string; precio: number; descripcion?: string; imagenUrl?: string };

export function agregarProducto(items: Item[], id: number): Item[] {
  const existe = items.some(item => item.id === id);
  return existe
    ? items.map(item => item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item)
    : [...items, { id, cantidad: 1 }];
}

export function eliminarProducto(items: Item[], id: number): Item[] {
  return items.filter(item => item.id !== id);
}

export function cambiarCantidad(items: Item[], id: number, cantidad: number): Item[] {
  const segura = Number.isFinite(cantidad) ? Math.max(1, Math.trunc(cantidad)) : 1;
  return items.map(item => item.id === id ? { ...item, cantidad: segura } : item);
}

export function subtotalProductos(items: Item[], productos: Producto[]): number {
  return items.reduce((total, item) =>
    total + (productos.find(p => p.id === item.id)?.precio ?? 0) * item.cantidad, 0);
}

export function totalCompra(items: Item[], productos: Producto[], servicio: number): number {
  return subtotalProductos(items, productos) + servicio;
}
