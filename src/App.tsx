import { Link, Route, Routes } from 'react-router';
import { Proveedor } from './context/DatosContext';
import Cabecera from './components/Cabecera';
import Inicio from './pages/Inicio';
import Configurar from './pages/Configurar';
import Catalogo from './pages/Catalogo';
import Categorias from './pages/Categorias';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import Resultado from './pages/Resultado';
import Login from './pages/Login';
import Admin from './pages/Admin';
import AdminCategorias from './pages/AdminCategorias';
import RutaAdmin from './components/RutaAdmin';
import RutaCliente from './components/RutaCliente';
import { AuthProveedor } from './context/AuthContext';

export default function App(){return <AuthProveedor><Proveedor><Cabecera/><main className="container py-5"><Routes><Route path="/" element={<Login/>}/><Route path="/planes" element={<Inicio/>}/><Route path="/productos" element={<RutaCliente><Configurar/></RutaCliente>}/><Route path="/sugeridos" element={<Catalogo modo="todos"/>}/><Route path="/categorias" element={<Categorias/>}/><Route path="/categorias/:categoria" element={<Catalogo modo="categoria"/>}/><Route path="/ofertas" element={<Catalogo modo="ofertas"/>}/><Route path="/carrito" element={<RutaCliente><Carrito/></RutaCliente>}/><Route path="/checkout" element={<RutaCliente><Checkout/></RutaCliente>}/><Route path="/resultado/:estado" element={<RutaCliente><Resultado/></RutaCliente>}/><Route path="/login" element={<Login/>}/><Route path="/admin/categorias" element={<RutaAdmin><AdminCategorias/></RutaAdmin>}/><Route path="/admin" element={<RutaAdmin><Admin/></RutaAdmin>}/><Route path="*" element={<section><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></section>}/></Routes></main><footer className="text-center py-4 text-muted">Recuerdo Animal · Proyecto académico</footer></Proveedor></AuthProveedor>}
