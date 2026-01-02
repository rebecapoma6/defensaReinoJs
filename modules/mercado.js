import { Producto } from './producto.js';

export const mercado = [
  new Producto('Espada corta', 120, 'común', 'arma', { ataque: 8 },'image/espadaCorta.jpg'),
  new Producto('Arco de caza', 140, 'común', 'arma', { ataque: 7 },'image/arcoCaza.jpg'),
  new Producto('Armadura de cuero', 120, 'común', 'armadura', { defensa: 6 },'image/armadura.png'),
  new Producto('Poción pequeña', 40, 'común', 'consumible', { vida: 20 },'image/posionPeque.jpg'),
  new Producto('Espada rúnica', 100, 'raro', 'arma', { ataque: 18 },'image/runica.jpg'),
  new Producto('Escudo de roble', 120, 'raro', 'armadura', { defensa: 14 },'image/escudo.jpg'),
  new Producto('Poción grande', 110, 'raro', 'consumible', { vida: 60 },'image/posionGrande.jpg'),
  new Producto('Mandoble épico', 150, 'épico', 'arma', { ataque: 32 },'image/mandoble.jpg'),
  new Producto('Placas dracónicas', 100, 'épico', 'armadura', { defensa: 28 },'image/placaDragonica.jpg'),
  new Producto('Elixir legendario', 120, 'épico', 'consumible', { vida: 150 },'image/posionLegendario.jpg'),
  
];

/**
 * Filtra los productos del mercado por el nivel de rareza especificado.
 * @param {string}  rareza - La rareza por la que se desea filtrar ("común", "raro", "épico", etc.). 
 * @returns {Array<Producto>} Un nuevo array con los productos que coinciden con la rareza.
 */
export function filtrarPorRareza(rareza) {
  return mercado.filter(producto => producto.rareza === rareza);
}

/**
 * 
 * @param {string} rareza - La rareza de los productos a los que se aplicará el descuento.
 * @param {number} porcentaje  - El porcentaje de descuento (0-100).
 * @returns {Array<Producto>} Un nuevo array con los productos actualizados (o clonados si no aplican descuento).
 */
export function aplicarDescuentoPorRareza(rareza, porcentaje) {
  return mercado.map(producto =>
    producto.rareza === rareza ? producto.aplicarDescuento(porcentaje) : producto
  );
}

/**
 * Busca un producto en el listado del mercado por su nombre, ignorando mayúsculas y minúsculas.
 * @param {string} nombre - El nombre del producto a buscar. 
 * @returns  {Producto | null} El objeto Producto si se encuentra, o null si no existe.
 */
export function buscarProducto(nombre) {
  return mercado.find(producto => producto.nombre.toLowerCase() === nombre.toLowerCase()) || null;
}

/**
 * Devuelve la representación en HTML o texto de un producto utilizando su método interno.
 * @param {Producto} producto - La instancia del producto a describir.
 * @returns {string} La descripción formateada del producto.
 */
export function describirProducto(producto) {
  return producto.mostrarProducto();
}

/**
 * Devuelve una lista de todas las rarezas únicas presentes en el mercado.
 * @returns {Array<string>} Lista de rarezas únicas ej: ["común", "raro", "épico"].
 */

export function obtenerRarezasUnicas() {
    const conjuntoRarezas = new Set(mercado.map(producto => producto.rareza));
    return Array.from(conjuntoRarezas);
}