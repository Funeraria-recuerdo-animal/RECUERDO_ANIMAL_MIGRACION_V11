import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Item, Producto } from '../cart';
import type { Categoria } from '../categorias';

type Datos = {
  plan: string; setPlan: (x: string) => void;
  peso: string; setPeso: (x: string) => void;
  zona: string; setZona: (x: string) => void;
  items: Item[]; setItems: (x: Item[]) => void;
  productos: Producto[]; categorias: Categoria[];
  recargar: () => Promise<void>; error: string;
};
const Context = createContext<Datos | null>(null);
export const useDatos = () => {
  const c = useContext(Context);
  if (!c) throw Error('Contexto');
  return c;
};
export function persist<T>(k: string, init: T): T {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) as T : init; }
  catch { return init; }
}
export function Proveedor({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState(() => persist('ra_plan', 'Silver'));
  const [peso, setPeso] = useState(() => persist('ra_peso', ''));
  const [zona, setZona] = useState(() => persist('ra_zona', ''));
  const [items, setItems] = useState<Item[]>(() => persist('ra_items', []));
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState('');
  async function recargar() {
    try {
      const [rp, rc] = await Promise.all([fetch('/api/productos'), fetch('/api/categorias')]);
      if (!rp.ok || !rc.ok) throw Error('API no disponible');
      const [p, c] = await Promise.all([rp.json() as Promise<Producto[]>, rc.json() as Promise<Categoria[]>]);
      setProductos(p); setCategorias(c); setError('');
    } catch { setError('No se pudo conectar con JSON Server o faltan categorías en db.json. Ejecuta npm run api desde esta Etapa 10.'); }
  }
  useEffect(() => { void recargar(); }, []);
  useEffect(() => { localStorage.setItem('ra_plan', JSON.stringify(plan)); }, [plan]);
  useEffect(() => { localStorage.setItem('ra_peso', JSON.stringify(peso)); }, [peso]);
  useEffect(() => { localStorage.setItem('ra_zona', JSON.stringify(zona)); }, [zona]);
  useEffect(() => { localStorage.setItem('ra_items', JSON.stringify(items)); }, [items]);
  return <Context.Provider value={{ plan, setPlan, peso, setPeso, zona, setZona, items, setItems, productos, categorias, recargar, error }}>{children}</Context.Provider>;
}
