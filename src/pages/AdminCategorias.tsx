import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { useDatos } from '../context/DatosContext';
import { normalizarNombre, productosDeCategoria, validarCategoria } from '../categorias';
import type { Categoria } from '../categorias';

export default function AdminCategorias() {
  const { categorias, productos, recargar, error } = useDatos();
  const [nombre, setNombre] = useState('');
  const [editar, setEditar] = useState<Categoria | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [ocupado, setOcupado] = useState(false);
  function limpiar() { setNombre(''); setEditar(null); }
  async function guardar(e: FormEvent) {
    e.preventDefault();
    const nuevo = normalizarNombre(nombre);
    const validacion = validarCategoria(categorias, nuevo, editar?.id);
    if (validacion) { setMensaje(validacion); return; }
    setOcupado(true);
    try {
      if (editar && editar.nombre !== nuevo) {
        // La categoría se identifica por nombre en los productos actuales.
        // Se actualizan sus productos ANTES de cambiar el nombre de la categoría.
        const asociados = productosDeCategoria(productos, editar.nombre);
        for (const producto of asociados) {
          const r = await fetch('/api/productos/' + producto.id, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...producto, categoria: nuevo }),
          });
          if (!r.ok) throw Error('No se pudo actualizar un producto asociado. Revisa los datos antes de reintentar.');
        }
      }
      const r = await fetch('/api/categorias' + (editar ? '/' + editar.id : ''), {
        method: editar ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...(editar ? { id: editar.id } : {}), nombre: nuevo }),
      });
      if (!r.ok) throw Error('No se pudo guardar la categoría.');
      limpiar(); setMensaje('Categoría guardada correctamente.');
    } catch (e) { setMensaje(e instanceof Error ? e.message : 'Error al guardar categoría.'); }
    finally { await recargar(); setOcupado(false); }
  }
  async function eliminar(c: Categoria) {
    const asociados = productosDeCategoria(productos, c.nombre);
    if (asociados.length) { setMensaje(`No se puede eliminar «${c.nombre}»: tiene ${asociados.length} producto(s). Reasígnalos antes.`); return; }
    if (!window.confirm(`¿Eliminar la categoría «${c.nombre}»?`)) return;
    setOcupado(true);
    try {
      const r = await fetch('/api/categorias/' + c.id, { method: 'DELETE' });
      if (!r.ok) throw Error();
      if (editar?.id === c.id) limpiar();
      setMensaje('Categoría eliminada.');
    } catch { setMensaje('No se pudo eliminar la categoría.'); }
    finally { await recargar(); setOcupado(false); }
  }
  return <section>
    <h1>Mantenedor de categorías</h1>
    <p><Link to="/admin" className="btn btn-outline-secondary">Volver a productos</Link></p>
    <p className="text-muted">Crea, modifica o elimina categorías. Al renombrar una categoría se actualizan los productos asociados. Para eliminarla, primero debes reasignar sus productos.</p>
    {error && <p className="alert alert-danger">{error}</p>}
    <form onSubmit={e => void guardar(e)} className="card card-body mb-4">
      <h2 className="h5">{editar ? 'Editar categoría' : 'Nueva categoría'}</h2>
      <label className="form-label">Nombre de categoría<input className="form-control" maxLength={80} required value={nombre} disabled={ocupado} onChange={e => setNombre(e.target.value)} /></label>
      <div className="d-flex gap-2"><button className="btn btn-primary" disabled={ocupado}>{editar ? 'Guardar cambios' : 'Agregar categoría'}</button>{editar && <button type="button" className="btn btn-secondary" disabled={ocupado} onClick={limpiar}>Cancelar</button>}</div>
    </form>
    {mensaje && <p role="status" className="alert alert-info">{mensaje}</p>}
    <div className="table-responsive"><table className="table"><thead><tr><th>Categoría</th><th>Productos asociados</th><th>Acciones</th></tr></thead><tbody>
      {categorias.map(c => <tr key={c.id}><td>{c.nombre}</td><td>{productosDeCategoria(productos, c.nombre).length}</td><td><div className="d-flex gap-2"><button className="btn btn-sm btn-outline-primary" disabled={ocupado} onClick={() => { setEditar(c); setNombre(c.nombre); setMensaje(''); window.scrollTo(0, 0); }}>Editar</button><button className="btn btn-sm btn-outline-danger" disabled={ocupado || productosDeCategoria(productos, c.nombre).length > 0} title={productosDeCategoria(productos, c.nombre).length > 0 ? 'Reasigna primero los productos asociados' : 'Eliminar categoría'} onClick={() => void eliminar(c)}>Eliminar</button></div></td></tr>)}
    </tbody></table></div>
  </section>;
}
