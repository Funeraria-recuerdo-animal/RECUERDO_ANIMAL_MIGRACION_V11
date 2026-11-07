import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
export default function Login() {
  const { sesion, entrar } = useAuth();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [mensaje, setMensaje] = useState('');
  if (sesion) return <Navigate to={sesion.rol === 'admin' ? '/admin' : '/planes'} replace />;
  function enviar(e: FormEvent) {
    e.preventDefault();
    const error = entrar(usuario, clave);
    setClave('');
    if (error) { setMensaje(error); return; }
    // Redirección a la ruta solicitada solo cuando corresponda al rol.
    navigate(usuario.trim().toLowerCase() === 'admin' ? '/admin' : '/planes', { replace: true });
  }
  return <section><h1>Iniciar sesión</h1>
    <form className="card card-body" onSubmit={enviar}>
      <label className="form-label">Usuario<input className="form-control" value={usuario} onChange={e => setUsuario(e.target.value)} required autoComplete="username" /></label>
      <label className="form-label">Contraseña<input type="password" className="form-control" value={clave} onChange={e => setClave(e.target.value)} required autoComplete="current-password" /></label>
      <button className="btn btn-primary">Ingresar</button>
      {mensaje && <p role="alert" className="alert alert-danger mt-3">{mensaje}</p>}
      <p className="small text-muted mt-3">Cuentas de demostración: <code>admin / Admin123</code> (administrador) y <code>jperez / User123</code> (cliente).</p>
    </form>
  </section>;
}
