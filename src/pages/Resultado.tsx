import { Link, useParams } from 'react-router';
import { clp } from '../pricing';
import { persist } from '../context/DatosContext';
export default function Resultado(){const {estado}=useParams();const pedido=persist<{id:number;nombre:string;total:number}|null>('ra_ultimo_pedido',null);return <section><h1>{estado==='exito'?'Pedido registrado':'No se pudo completar el pedido'}</h1>{estado==='exito'?<p>Gracias, {pedido?.nombre}. Tu solicitud #{pedido?.id} por {clp(pedido?.total||0)} fue registrada localmente como demostración.</p>:<p>Revisa los datos y vuelve a intentarlo.</p>}{estado!=='exito'&&<Link className="btn btn-outline-primary me-2" to="/checkout">Reintentar checkout</Link>}<Link className="btn btn-primary" to="/">Volver al inicio</Link></section>}
