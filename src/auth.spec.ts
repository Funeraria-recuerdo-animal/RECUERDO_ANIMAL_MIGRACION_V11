import { DURACION_SESION, intentarLogin, puedeAdministrar, puedeComprar, validarSesion } from './auth';
describe('Autenticación de demostración', () => {
  const limpio = { cantidad: 0, bloqueadoHasta: 0 };
  it('permite entrar al administrador con rol admin', () => {
    const r = intentarLogin('admin', 'Admin123', limpio, 1000);
    expect(r.resultado.sesion?.rol).toBe('admin');
    expect(r.resultado.sesion?.expira).toBe(1000 + DURACION_SESION);
  });
  it('permite entrar al cliente sin privilegios administrativos', () => {
    const r = intentarLogin('jperez', 'User123', limpio);
    expect(r.resultado.sesion?.rol).toBe('user');
    expect(puedeAdministrar(r.resultado.sesion)).toBeFalse();
  });
  it('rechaza contraseñas incorrectas y cuenta intentos', () => {
    const r = intentarLogin('admin', 'incorrecta', limpio, 1000);
    expect(r.resultado.sesion).toBeNull();
    expect(r.intentos.cantidad).toBe(1);
  });
  it('bloquea temporalmente tras cinco fallos', () => {
    let intentos = limpio;
    for (let i = 0; i < 5; i++) intentos = intentarLogin('admin', 'mal', intentos, 1000).intentos;
    expect(intentos.bloqueadoHasta).toBe(61000);
    expect(intentarLogin('admin', 'Admin123', intentos, 2000).resultado.sesion).toBeNull();
  });
  it('permite reintentar tras el bloqueo', () => {
    const r = intentarLogin('admin', 'Admin123', { cantidad: 5, bloqueadoHasta: 61000 }, 61001);
    expect(r.resultado.sesion?.rol).toBe('admin');
  });
  it('rechaza cuentas desactivadas', () => {
    expect(intentarLogin('cbravo', 'User123', limpio).resultado.error).toContain('desactivada');
  });
  it('considera inválida una sesión vencida', () => {
    const sesion = intentarLogin('admin', 'Admin123', limpio, 1000).resultado.sesion;
    expect(validarSesion(sesion, 1000 + DURACION_SESION)).toBeFalse();
    expect(validarSesion(sesion, 1001)).toBeTrue();
  });
  it('reconoce privilegios de administrador en sesión vigente', () => {
    const sesion = intentarLogin('admin', 'Admin123', limpio).resultado.sesion;
    expect(puedeAdministrar(sesion)).toBeTrue();
  });
});

describe('Permisos de compra', () => {
  it('permite comprar a un cliente autenticado', () => {
    const sesion = intentarLogin('jperez', 'User123', { cantidad: 0, bloqueadoHasta: 0 }).resultado.sesion;
    expect(puedeComprar(sesion)).toBeTrue();
  });
  it('no permite comprar al administrador', () => {
    const sesion = intentarLogin('admin', 'Admin123', { cantidad: 0, bloqueadoHasta: 0 }).resultado.sesion;
    expect(puedeComprar(sesion)).toBeFalse();
  });
  it('no permite comprar sin sesión ni con una sesión de rol desconocido', () => {
    const sesion = intentarLogin('jperez', 'User123', { cantidad: 0, bloqueadoHasta: 0 }).resultado.sesion;
    expect(puedeComprar(null)).toBeFalse();
    expect(validarSesion({ ...sesion, rol: 'desconocido' })).toBeFalse();
  });
});
