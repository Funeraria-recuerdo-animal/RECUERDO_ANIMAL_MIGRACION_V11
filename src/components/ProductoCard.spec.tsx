import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import ProductoCard from './ProductoCard';
import type { Producto } from '../cart';

const producto: Producto = { id: 7, nombre: 'Ánfora de recuerdo', categoria: 'Recuerdos', precio: 15000 };

describe('ProductoCard de Recuerdo Animal', () => {
  it('renderiza el nombre, categoría y precio recibidos por props', () => {
    const html = renderToStaticMarkup(createElement(ProductoCard, { producto, onAgregar: () => {} }));
    expect(html).toContain('Ánfora de recuerdo');
    expect(html).toContain('Recuerdos');
    expect(html).toContain('15.000');
  });

  it('no muestra confirmación antes de agregar el producto', () => {
    const html = renderToStaticMarkup(createElement(ProductoCard, { producto, onAgregar: () => {} }));
    expect(html).not.toContain('Producto agregado');
  });

  it('invoca el callback onAgregar con el identificador correcto al hacer clic', () => {
    const contenedor = document.createElement('div');
    document.body.appendChild(contenedor);
    const root = createRoot(contenedor);
    const ids: number[] = [];
    try {
      flushSync(() => root.render(createElement(ProductoCard, { producto, onAgregar: id => ids.push(id) })));
      const boton = contenedor.querySelector('button');
      expect(boton).not.toBeNull();
      flushSync(() => boton!.dispatchEvent(new MouseEvent('click', { bubbles: true })));
      expect(ids).toEqual([7]);
    } finally {
      flushSync(() => root.unmount());
      contenedor.remove();
    }
  });

  it('actualiza su estado y muestra confirmación tras el clic', () => {
    const contenedor = document.createElement('div');
    document.body.appendChild(contenedor);
    const root = createRoot(contenedor);
    try {
      flushSync(() => root.render(createElement(ProductoCard, { producto, onAgregar: () => {} })));
      expect(contenedor.querySelector('[role="status"]')).toBeNull();
      flushSync(() => contenedor.querySelector('button')!.dispatchEvent(new MouseEvent('click', { bubbles: true })));
      expect(contenedor.querySelector('[role="status"]')?.textContent).toContain('Producto agregado');
    } finally {
      flushSync(() => root.unmount());
      contenedor.remove();
    }
  });
  it('oculta el botón de compra para el administrador en modo consulta', () => {
    const html = renderToStaticMarkup(createElement(ProductoCard, { producto, onAgregar: () => {}, soloLectura: true }));
    expect(html).toContain('Ánfora de recuerdo');
    expect(html).not.toContain('Agregar al carrito');
  });

});
