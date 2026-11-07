/** Autenticación exclusivamente demostrativa: nunca utilizar estas credenciales en producción. */
export type Rol = 'admin' | 'user';
export type Sesion = { id: number; usuario: string; nombre: string; rol: Rol; expira: number };
type UsuarioDemo = Omit<Sesion, 'expira'> & { clave: string; activo: boolean };
export const CLAVE_SESION = 'ra_sesion_demo';
export const CLAVE_INTENTOS = 'ra_intentos_demo';
export const DURACION_SESION = 30 * 60 * 1000;
export const DURACION_BLOQUEO = 60 * 1000;
export const MAX_INTENTOS = 5;
export const USUARIOS_DEMO: UsuarioDemo[] = [
  { id: 1, usuario: 'admin', nombre: 'Ana Muñoz', rol: 'admin', clave: 'Admin123', activo: true },
  { id: 2, usuario: 'jperez', nombre: 'Juan Pérez', rol: 'user', clave: 'User123', activo: true },
  { id: 4, usuario: 'cbravo', nombre: 'Carlos Bravo', rol: 'user', clave: 'User123', activo: false },
];
type Intentos = { cantidad: number; bloqueadoHasta: number };
export type ResultadoLogin = { sesion: Sesion | null; error: string };
export function validarSesion(sesion: unknown, ahora = Date.now()): sesion is Sesion {
  if (!sesion || typeof sesion !== 'object') return false;
  const s = sesion as Partial<Sesion>;
  return typeof s.id === 'number' && typeof s.usuario === 'string' &&
    typeof s.nombre === 'string' && ['admin', 'user'].includes(s.rol ?? '') &&
    typeof s.expira === 'number' && Number.isFinite(s.expira) && s.expira > ahora;
}
export function puedeAdministrar(sesion: Sesion | null): boolean {
  return !!sesion && validarSesion(sesion) && sesion.rol === 'admin';
}
export function intentarLogin(usuario: string, clave: string, intentos: Intentos, ahora = Date.now()):
  { resultado: ResultadoLogin; intentos: Intentos } {
  if (intentos.bloqueadoHasta > ahora) {
    const segundos = Math.ceil((intentos.bloqueadoHasta - ahora) / 1000);
    return { resultado: { sesion: null, error: `Demasiados intentos fallidos. Espera ${segundos} segundos.` }, intentos };
  }
  const actuales = intentos.bloqueadoHasta && intentos.bloqueadoHasta <= ahora
    ? { cantidad: 0, bloqueadoHasta: 0 } : intentos;
  if (!usuario.trim() || !clave) {
    return { resultado: { sesion: null, error: 'Escribe tu usuario y tu contraseña.' }, intentos: actuales };
  }
  const encontrado = USUARIOS_DEMO.find(u => u.usuario.toLowerCase() === usuario.trim().toLowerCase() && u.clave === clave);
  if (!encontrado) {
    const cantidad = actuales.cantidad + 1;
    const bloqueadoHasta = cantidad >= MAX_INTENTOS ? ahora + DURACION_BLOQUEO : 0;
    return { resultado: { sesion: null, error: bloqueadoHasta ? 'Demasiados intentos fallidos. Espera 60 segundos.' : 'Usuario o contraseña incorrectos.' }, intentos: { cantidad, bloqueadoHasta } };
  }
  if (!encontrado.activo) {
    return { resultado: { sesion: null, error: 'Tu cuenta está desactivada. Contacta al administrador.' }, intentos: actuales };
  }
  const { id, nombre, rol } = encontrado;
  return { resultado: { sesion: { id, usuario: encontrado.usuario, nombre, rol, expira: ahora + DURACION_SESION }, error: '' }, intentos: { cantidad: 0, bloqueadoHasta: 0 } };
}
export function leerIntentos(): Intentos {
  try {
    const datos: unknown = JSON.parse(localStorage.getItem(CLAVE_INTENTOS) || 'null');
    if (datos && typeof datos === 'object') {
      const d = datos as Partial<Intentos>;
      if (typeof d.cantidad === 'number' && typeof d.bloqueadoHasta === 'number') return { cantidad: d.cantidad, bloqueadoHasta: d.bloqueadoHasta };
    }
  } catch { /* Reiniciar datos corruptos */ }
  return { cantidad: 0, bloqueadoHasta: 0 };
}
export function leerSesion(): Sesion | null {
  try {
    const sesion: unknown = JSON.parse(sessionStorage.getItem(CLAVE_SESION) || 'null');
    if (validarSesion(sesion)) return sesion;
  } catch { /* Sesión corrupta */ }
  sessionStorage.removeItem(CLAVE_SESION);
  return null;
}

/** Solo una sesión de cliente activa permite contratar y comprar. */
export function puedeComprar(sesion: Sesion | null): boolean {
  return !!sesion && validarSesion(sesion) && sesion.rol === 'user';
}
