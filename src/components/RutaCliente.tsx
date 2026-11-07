import { Navigate, useLocation } from 'react-router';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { puedeComprar } from '../auth';

/** Solo clientes autenticados pueden configurar, comprar y finalizar pedidos. */
export default function RutaCliente({ children }: { children: ReactNode }) {
  const { sesion } = useAuth();
  const location = useLocation();
  if (sesion?.rol === 'admin') return <Navigate to="/admin" replace />;
  if (!puedeComprar(sesion)) return <Navigate to="/login" state={{ desde: location.pathname }} replace />;
  return <>{children}</>;
}
