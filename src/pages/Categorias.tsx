import { Link } from 'react-router';
import { useDatos } from '../context/DatosContext';
export default function Categorias(){const {categorias}=useDatos();return <section><h1>Categorías</h1><div className="row g-3">{categorias.map(c=><div className="col-md-4" key={c.id}><Link className="card card-body text-decoration-none" to={'/categorias/'+encodeURIComponent(c.nombre)}><h2 className="h5">{c.nombre}</h2><span>Ver productos</span></Link></div>)}</div></section>}
