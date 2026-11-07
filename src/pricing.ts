export const pesos: Record<string, number> = {'0-1':55000,'1-5':65000,'6-10':75000,'11-15':85000,'16-25':100000,'26-35':120000,'36-45':140000,'46-55':160000,'56-65':180000,'66-75':200000};
export const zonas: Record<string, number> = {'Region Metropolitana':0,'Zona 1':5000,'Zona 2':10000,'Zona 3':15000,'Zona 4':20000,'Zona 5':30000};
export function precioServicio(plan: string, peso: string, zona: string): number { if(!(peso in pesos)||!(zona in zonas)||!['Silver','Gold'].includes(plan)) return 0; return pesos[peso]+(plan==='Gold'?35000:0)+zonas[zona]; }
export const clp = (n:number) => new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(n);
