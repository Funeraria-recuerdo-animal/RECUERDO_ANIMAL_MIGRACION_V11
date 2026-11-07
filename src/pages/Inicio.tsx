import { Link } from 'react-router';
import { useDatos } from '../context/DatosContext';

export default function Inicio() {
  const { plan, setPlan } = useDatos();
  const planes = [
    {
      nombre: 'Silver',
      plazo: 'Hasta 7 días hábiles',
      descripcion: 'Servicio de cremación y despedida respetuosa de tu mascota, con un plazo de entrega de hasta 7 días hábiles.',
      precio: 'Precio base según el peso y la zona de retiro.',
    },
    {
      nombre: 'Gold',
      plazo: 'Hasta 3 días hábiles',
      descripcion: 'El mismo servicio de cremación y despedida del plan Silver, pero con entrega prioritaria en hasta 3 días hábiles.',
      precio: 'Recargo de $35.000 sobre el plan Silver. El costo de retiro se calcula por separado.',
    },
  ];
  return <section>
    <h1>Un homenaje lleno de amor</h1>
    <p className="lead">Acompañamos la despedida de tu mascota con respeto y cariño.</p>
    <p>Ambos planes ofrecen el mismo servicio. La diferencia es el plazo de entrega: Silver hasta 7 días hábiles y Gold hasta 3 días hábiles.</p>
    <div className="row g-3">
      {planes.map(x => <div className="col-md-6" key={x.nombre}>
        <div className={'card h-100 ' + (plan === x.nombre ? 'selected' : '')}>
          <div className="card-body d-flex flex-column">
            <h2>Plan {x.nombre}</h2>
            <p className="fw-bold text-success">{x.plazo}</p>
            <p>{x.descripcion}</p>
            <p className="small text-muted">{x.precio}</p>
            <button className="btn btn-outline-success mt-auto" onClick={() => setPlan(x.nombre)}>
              {plan === x.nombre ? 'Seleccionado' : 'Seleccionar'}
            </button>
          </div>
        </div>
      </div>)}
    </div>
    <Link className="btn btn-primary mt-4" to="/productos">Continuar con {plan}</Link>
  </section>;
}
