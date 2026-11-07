import { Navigate, useLocation } from 'react-router';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { puedeAdministrar } from '../auth';
export default function RutaAdmin({ children }: { children: ReactNode }) {
  const { sesion } = useAuth();
  const ubicacion = useLocation();
  if (!sesion) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  if (!puedeAdministrar(sesion)) return <section role="alert"><h1>Acceso restringido</h1><p>Esta sección está reservada para administradores.</p></section>;
  return <>{children}</>;
}
