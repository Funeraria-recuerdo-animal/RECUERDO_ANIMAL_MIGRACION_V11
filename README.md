# Recuerdo Animal

**Recuerdo Animal** es una aplicación web académica para la contratación simulada de servicios funerarios para mascotas y la compra de productos conmemorativos. El proyecto fue migrado desde HTML y JavaScript a **React, TypeScript y Vite**.

> **Importante:** es una demostración académica. No procesa pagos reales y la autenticación no está diseñada para producción.

## Funcionalidades

- **Inicio de sesión como pantalla inicial:** al abrir `/` se muestra el login. Tras ingresar, el cliente accede a los planes y el administrador a su panel.
- **Dos roles:** `admin` y `user` (cliente). No existe un perfil de vendedor.
- **Planes de servicio:**
  - **Silver:** entrega en hasta **7 días hábiles**.
  - **Gold:** el mismo servicio, con entrega prioritaria en hasta **3 días hábiles** y un recargo de **$35.000** respecto de Silver.
  - El precio final del servicio considera los parámetros de contratación, como el peso y la zona de retiro.
- **Catálogo de productos:** consulta por productos, categorías y ofertas.
- **Carrito:** agregar productos, modificar cantidades, eliminar artículos y calcular subtotales y total.
- **Checkout simulado:** solicita información de contacto y de la mascota; permite simular una operación aprobada o rechazada, sin pago real.
- **Administración:** mantenimiento de productos y categorías mediante JSON Server. Se evita eliminar categorías con productos asociados.
- **Restricciones de acceso:** las rutas de compra requieren una sesión de cliente; el administrador no puede realizar compras desde la interfaz.
- **Pruebas unitarias:** archivos Jasmine para lógica de negocio y componentes React, ejecutados con Karma.

## Tecnologías

- React + TypeScript
- Vite
- React Router
- Bootstrap
- JSON Server (API REST local simulada, con datos en `db.json`)
- Jasmine + Karma (pruebas)
- `localStorage` (persistencia local de ciertos estados de la demostración)

## Requisitos

- Node.js y npm compatibles con las dependencias del proyecto (recomendado Node.js **22.12 o superior**).
- Navegador moderno; Chrome o Microsoft Edge para las pruebas con Karma.
- Windows con PowerShell para seguir los comandos de esta guía. En otros sistemas puede utilizarse `npm` en lugar de `npm.cmd`.

## Cómo ejecutar el proyecto

Abre dos terminales en la **carpeta que contiene `package.json`**.

**Primera terminal — API local:**

```powershell
npm.cmd run api
```

**Segunda terminal — aplicación React:**

```powershell
npm.cmd run dev
```

Abre la dirección indicada por Vite, habitualmente **http://localhost:5173**. JSON Server utiliza **http://127.0.0.1:3000** y la aplicación accede a la API mediante el proxy `/api` de Vite.

### Si el proyecto se descargó desde GitHub

Antes de iniciar los servidores, instala las dependencias una vez:

```powershell
npm.cmd ci
```

Este comando utiliza `package-lock.json`. **GitHub no necesita almacenar `node_modules`**.

### Si se utiliza la copia preparada para la presentación

Si la carpeta ya contiene `node_modules` y **fue comprobada en el mismo equipo**, puedes iniciar directamente los dos servidores sin descargar dependencias. Se recomienda probar esta copia con anticipación, porque algunas dependencias pueden depender del sistema operativo y de la versión de Node.js.

## Cuentas de demostración

| Usuario | Contraseña | Rol | Acceso principal |
| --- | --- | --- | --- |
| `admin` | `Admin123` | Administrador | Gestión de productos y categorías; consulta de catálogo |
| `jperez` | `User123` | Cliente | Selección de planes, productos, carrito y checkout |

Las credenciales están definidas para la demostración y **no deben reutilizarse en sistemas reales**. La sesión simulada tiene una duración de 30 minutos y se contempla un bloqueo temporal tras cinco intentos fallidos.

## Recorrido sugerido para la presentación

1. Abrir la aplicación y mostrar que la pantalla inicial es **Iniciar sesión**.
2. Ingresar como `jperez` y comparar los plazos de **Silver (7 días hábiles)** y **Gold (3 días hábiles, +$35.000)**.
3. Seleccionar un plan, configurar el servicio y revisar el precio calculado.
4. Consultar el catálogo, agregar productos al carrito y modificar cantidades.
5. Completar el checkout y demostrar el resultado simulado de pago.
6. Cerrar sesión e ingresar como `admin`.
7. Mostrar la administración de productos y categorías, y las restricciones de compra del administrador.
8. Si el tiempo lo permite, mostrar la ejecución de pruebas Jasmine.

## Pruebas y comprobaciones

En la carpeta del proyecto:

```powershell
npm.cmd run build
npm.cmd run test
```

Comprobaciones adicionales:

```powershell
npm.cmd run lint
```

El código incluye **31 casos de prueba Jasmine definidos** para precios, carrito, autenticación/permisos, categorías y el componente de tarjeta de producto. **Que existan 31 casos no significa que se hayan ejecutado correctamente en esta copia**: el resultado debe verificarse y registrarse al correr `npm.cmd run test`. La cantidad de pruebas aprobadas tampoco equivale al porcentaje de cobertura del código.

## Organización principal

```text
src/
  components/       Componentes de interfaz y protección de rutas
  context/          Estado compartido y autenticación simulada
  pages/            Vistas de cliente y administración
  auth.ts           Reglas de autenticación y permisos
  cart.ts           Operaciones del carrito
  pricing.ts        Cálculo de precios del servicio
  categorias.ts     Reglas de categorías
  *.spec.ts         Pruebas unitarias
public/             Recursos e imágenes locales
db.json             Datos de demostración para JSON Server
karma.conf.cjs      Configuración de pruebas
package.json        Scripts y dependencias
package-lock.json   Versiones de dependencias
```

## Consideraciones y limitaciones

- La autenticación y los permisos se comprueban en la aplicación cliente. **JSON Server no aplica autorización real** sobre los datos.
- El checkout es simulado: no existe pasarela de pago ni confirmación bancaria. Parte de la información de la demostración se almacena localmente en el navegador.
- Las modificaciones administrativas actualizan los datos de `db.json` a través de JSON Server. Antes de exponer, conviene conservar una copia de respaldo de este archivo.
- El cambio de nombre de una categoría puede implicar varias actualizaciones de productos; JSON Server no proporciona transacciones atómicas.
- El proyecto debe ejecutarse con la API local activa para consultar y modificar los datos.
- Este repositorio corresponde a un **proyecto académico**, no a un servicio comercial desplegado ni a un sistema preparado para almacenar información personal real.

## Entrega y repositorio

Este `README.md` concentra las instrucciones de la versión final. Para publicar en GitHub se recomienda subir el código fuente, `public`, `db.json`, las configuraciones y los archivos de dependencias (`package.json` y `package-lock.json`), pero excluir `node_modules` y `dist` mediante `.gitignore`.

Para la demostración presencial puede conservarse **una copia independiente con `node_modules` ya instalado**, siempre que se haya probado en el equipo de presentación.
