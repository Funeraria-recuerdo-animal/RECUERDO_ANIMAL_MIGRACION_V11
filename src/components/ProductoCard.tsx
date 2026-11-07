import { useState } from 'react';
import { clp } from '../pricing';
import type { Producto } from '../cart';

type Props = {
  producto: Producto;
  onAgregar: (id: number) => void;
  soloLectura?: boolean;
};

export default function ProductoCard({ producto, onAgregar, soloLectura = false }: Props) {
  const [agregado, setAgregado] = useState(false);
  function agregar() {
    if (soloLectura) return;
    onAgregar(producto.id);
    setAgregado(true);
  }
  return (
    <div className="col-sm-6 col-lg-4">
      <article className="card h-100">
        <div className="card-body d-flex flex-column">
          <span className="text-muted small">{producto.categoria}</span>
          {producto.imagenUrl && <img src={producto.imagenUrl} alt={producto.nombre} className="img-fluid rounded mb-2" loading="lazy" />}
          <h2 className="h5 mt-2">{producto.nombre}</h2>
          {producto.descripcion && <p className="small">{producto.descripcion}</p>}
          <p className="mt-auto fw-bold">{clp(producto.precio)}</p>
          {!soloLectura && <button type="button" className="btn btn-outline-success" onClick={agregar}>
            Agregar al carrito
          </button>}
          {agregado && <p role="status" className="text-success small mt-2">Producto agregado</p>}
        </div>
      </article>
    </div>
  );
}
