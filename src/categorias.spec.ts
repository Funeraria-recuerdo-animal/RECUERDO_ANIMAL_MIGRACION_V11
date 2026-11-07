import { categoriaDuplicada, normalizarNombre, productosDeCategoria, validarCategoria } from './categorias';
import type { Categoria } from './categorias';
const categorias: Categoria[] = [{ id: 1, nombre: 'Ánfora' }, { id: 2, nombre: 'Urna' }];
describe('Reglas de categorías', () => {
  it('normaliza espacios del nombre', () => expect(normalizarNombre('  Arreglo   Floral ')).toBe('Arreglo Floral'));
  it('rechaza nombres vacíos', () => expect(validarCategoria(categorias, '   ')).toContain('nombre'));
  it('rechaza duplicados ignorando mayúsculas y espacios', () => expect(categoriaDuplicada(categorias, '  ánfora  ')).toBeTrue());
  it('permite editar una categoría sin cambiar su propio nombre', () => expect(validarCategoria(categorias, 'Ánfora', 1)).toBe(''));
  it('identifica productos asociados antes de eliminar', () => expect(productosDeCategoria([{ id: 1, nombre: 'A', categoria: 'Urna', precio: 10 }], 'Urna').length).toBe(1));
});
