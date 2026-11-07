import { agregarProducto, eliminarProducto, cambiarCantidad, subtotalProductos, totalCompra } from './cart';
import type { Producto } from './cart';

const productos: Producto[] = [
  { id: 1, nombre: 'Ánfora', categoria: 'Recuerdos', precio: 15000 },
  { id: 2, nombre: 'Collar', categoria: 'Recuerdos', precio: 5000 },
];

describe('Carrito de Recuerdo Animal', () => {
  it('agrega un producto nuevo', () => {
    expect(agregarProducto([], 1)).toEqual([{ id: 1, cantidad: 1 }]);
  });

  it('incrementa la cantidad de un producto repetido', () => {
    expect(agregarProducto([{ id: 1, cantidad: 1 }], 1))
      .toEqual([{ id: 1, cantidad: 2 }]);
  });

  it('elimina un producto sin alterar los demás', () => {
    expect(eliminarProducto([{ id: 1, cantidad: 1 }, { id: 2, cantidad: 2 }], 1))
      .toEqual([{ id: 2, cantidad: 2 }]);
  });

  it('modifica la cantidad de un producto', () => {
    expect(cambiarCantidad([{ id: 1, cantidad: 1 }], 1, 3))
      .toEqual([{ id: 1, cantidad: 3 }]);
  });

  it('no permite cantidades menores que uno', () => {
    expect(cambiarCantidad([{ id: 1, cantidad: 2 }], 1, 0))
      .toEqual([{ id: 1, cantidad: 1 }]);
  });

  it('calcula el subtotal de los productos', () => {
    expect(subtotalProductos([{ id: 1, cantidad: 2 }, { id: 2, cantidad: 1 }], productos))
      .toBe(35000);
  });

  it('suma el costo del servicio al total', () => {
    expect(totalCompra([{ id: 1, cantidad: 2 }], productos, 55000)).toBe(85000);
  });
});
