import { Link, NavLink, useNavigate } from 'react-router';
import { useDatos } from '../context/DatosContext';
import { useAuth } from '../context/AuthContext';
import { puedeComprar } from '../auth';

export default function Cabecera() {
  const { items } = useDatos();
  const { sesion, salir } = useAuth();
  const navigate = useNavigate();
  const esAdmin = sesion?.rol === 'admin';
  const esCliente = puedeComprar(sesion);
  return <header className="navbar navbar-expand-lg navbar-dark ra-nav">
    <div className="container flex-wrap gap-2">
      <Link className="navbar-brand fw-bold" to={esAdmin ? '/admin' : esCliente ? '/planes' : '/'}>🐾 Recuerdo Animal</Link>
      <nav className="d-flex gap-3 flex-wrap align-items-center">
        {esAdmin ? <>
          <NavLink to="/admin">Administrar productos</NavLink>
          <NavLink to="/admin/categorias">Administrar categorías</NavLink>
          <NavLink to="/sugeridos">Consultar catálogo</NavLink>
          <NavLink to="/categorias">Categorías</NavLink>
        </> : <>
          <NavLink to="/planes">Servicios</NavLink>
          <NavLink to="/productos">Configurar</NavLink>
          <NavLink to="/sugeridos">Productos</NavLink>
          <NavLink to="/categorias">Categorías</NavLink>
          <NavLink to="/ofertas">Ofertas</NavLink>
          {esCliente && <NavLink to="/carrito">Carrito ({items.reduce((a,b)=>a+b.cantidad,0)})</NavLink>}
        </>}
        {sesion ? <>
          <span className="text-white small">{sesion.nombre}</span>
          <button type="button" className="btn btn-sm btn-outline-light" onClick={() => { salir(); navigate('/login'); }}>Cerrar sesión</button>
        </> : <NavLink to="/login">Ingresar</NavLink>}
      </nav>
    </div>
  </header>;
}
