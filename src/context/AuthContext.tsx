import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { CLAVE_INTENTOS, CLAVE_SESION, intentarLogin, leerIntentos, leerSesion, validarSesion } from '../auth';
import type { Sesion } from '../auth';
type AuthContexto = { sesion: Sesion | null; entrar: (usuario: string, clave: string) => string; salir: () => void };
const Contexto = createContext<AuthContexto | null>(null);
export function AuthProveedor({ children }: { children: ReactNode }) {
  const [guardada, setGuardada] = useState<Sesion | null>(leerSesion);
  const sesion = validarSesion(guardada) ? guardada : null;
  function entrar(usuario: string, clave: string): string {
    const { resultado, intentos } = intentarLogin(usuario, clave, leerIntentos());
    localStorage.setItem(CLAVE_INTENTOS, JSON.stringify(intentos));
    if (resultado.sesion) {
      sessionStorage.setItem(CLAVE_SESION, JSON.stringify(resultado.sesion));
      setGuardada(resultado.sesion);
    }
    return resultado.error;
  }
  function salir() { sessionStorage.removeItem(CLAVE_SESION); setGuardada(null); }
  return <Contexto.Provider value={{ sesion, entrar, salir }}>{children}</Contexto.Provider>;
}
export function useAuth() { const c = useContext(Contexto); if (!c) throw Error('AuthProveedor no encontrado'); return c; }
