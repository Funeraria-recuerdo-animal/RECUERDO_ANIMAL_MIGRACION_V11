import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { clp } from '../pricing';
import { useDatos } from '../context/DatosContext';
export default function Admin() {
  const { productos, categorias, recargar, error } = useDatos();
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [editar, setEditar] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');
  useEffect(() => { if (editar === null && !categoria && categorias.length) setCategoria(categorias[0].nombre); }, [categorias, categoria, editar]);
  function limpiar() { setNombre(''); setCategoria(categorias[0]?.nombre ?? ''); setPrecio(''); setDescripcion(''); setImagenUrl(''); setEditar(null); }
  async function guardar(e: FormEvent) {
    e.preventDefault();
    if (!categorias.some(c => c.nombre === categoria)) { setMensaje('Selecciona una categoría válida de la lista.'); return; }
    try {
      const r = await fetch('/api/productos' + (editar !== null ? '/' + editar : ''), {
        method: editar !== null ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...(editar !== null ? { id: editar } : {}), nombre: nombre.trim(), categoria, precio: Number(precio), descripcion, imagenUrl }),
      });
      if (!r.ok) throw Error();
      limpiar(); setMensaje('Producto guardado'); await recargar();
    } catch { setMensaje('Error al guardar. Revisa JSON Server.'); }
  }
  async function borrar(id: number) {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try { const r = await fetch('/api/productos/' + id, { method: 'DELETE' }); if (!r.ok) throw Error(); await recargar(); setMensaje('Producto eliminado'); }
    catch { setMensaje('No se pudo eliminar el producto'); }
  }
  return <section>
    <h1>Administración de productos</h1>
    <p className="alert alert-warning">Acceso limitado al rol administrador en esta demostración React. JSON Server no está protegido y no debe exponerse públicamente.</p>
    <p><Link to="/admin/categorias" className="btn btn-outline-primary">Administrar categorías</Link></p>
    {error && <p className="alert alert-danger">{error}</p>}
    <form onSubmit={guardar} className="card card-body mb-4">
      <h2 className="h5">{editar === null ? 'Nuevo producto' : 'Editar producto'}</h2>
      <label className="form-label">Nombre<input className="form-control" required value={nombre} onChange={e => setNombre(e.target.value)} /></label>
      <label className="form-label">Categoría
        <select className="form-select" required value={categoria} onChange={e => setCategoria(e.target.value)} disabled={!categorias.length}>
          {!categorias.length && <option value="">No hay categorías disponibles</option>}
          {categorias.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
        </select>
      </label>
      {!categorias.length && <p className="text-danger">Crea primero una categoría en el mantenedor.</p>}
      <label className="form-label">Precio<input type="number" min="1" className="form-control" required value={precio} onChange={e => setPrecio(e.target.value)} /></label>
      <label className="form-label">Descripción (opcional)<textarea className="form-control" value={descripcion} onChange={e => setDescripcion(e.target.value)} /></label>
      <label className="form-label">URL de imagen (opcional)<input type="url" className="form-control" value={imagenUrl} onChange={e => setImagenUrl(e.target.value)} /></label>
      <div className="d-flex gap-2"><button className="btn btn-primary" disabled={!categorias.length}>{editar === null ? 'Crear' : 'Guardar cambios'}</button>{editar !== null && <button type="button" className="btn btn-secondary" onClick={() => { limpiar(); setMensaje(''); }}>Cancelar</button>}</div>
    </form>
    {mensaje && <p role="status">{mensaje}</p>}
    <div className="table-responsive"><table className="table"><thead><tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Acciones</th></tr></thead><tbody>
      {productos.map(p => <tr key={p.id}><td>{p.nombre}</td><td>{p.categoria}</td><td>{clp(p.precio)}</td><td><div className="d-flex gap-2"><button className="btn btn-sm btn-outline-primary" onClick={() => { setEditar(p.id); setNombre(p.nombre); setCategoria(p.categoria); setPrecio(String(p.precio)); setDescripcion(p.descripcion || ''); setImagenUrl(p.imagenUrl || ''); window.scrollTo(0, 0); }}>Editar</button><button className="btn btn-sm btn-outline-danger" onClick={() => void borrar(p.id)}>Eliminar</button></div></td></tr>)}
    </tbody></table></div>
  </section>;
}
