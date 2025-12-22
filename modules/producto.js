import { EUR } from '../utils/utils.js';

export class Producto {
  precioOriginal;
  /**
   * Crea una nueva instancia de Producto.
   * @param {string} nombre - Nombre del producto.
   * @param {number} precio - Precio base del producto.
   * @param {string} rareza - Nivel de rareza (por ejemplo: "común", "raro", "épico").
   * @param {string} tipo - Tipo de producto (por ejemplo: "arma", "poción", "armadura").
   * @param {Object} bonus - Objeto con los bonus del producto, por ejemplo { ataque: 5, defensa: 2 }.
   */
  constructor(nombre, precio, rareza, tipo, bonus, imagen, precioOriginal = precio) {
    this.nombre = nombre;
    this.precio = precio;
    this.rareza = rareza;
    this.tipo = tipo;
    this.bonus = bonus;
    this.imagen = imagen;
    this.precioOriginal = precioOriginal;

  }

  /**
   * Devuelve una representación en texto del producto.
   * @returns {string} Descripción del producto.
   */
  mostrarProducto() {
    
    let estadisticaPrincipal = '';
    const iconos = {
        ataque: '⚔️',
        defensa: '🛡️',
        vida: '❤️'
    };
    for (const clave in this.bonus) {
        if (this.bonus[clave] > 0) {
            const icono = iconos[clave] || '✨';
            // Formato: ⚔️ Ataque: +8
            estadisticaPrincipal = `<p class="product-stat">${icono} ${clave.charAt(0).toUpperCase() + clave.slice(1)}: +${this.bonus[clave]}</p>`;
            break; // Solo mostramos la primera estadística encontrada
        }
    }
    
    // Lógica para mostrar el precio y el descuento
    let precioTexto = EUR.format(this.precio);
    if (this.precio < this.precioOriginal) {
      // Si el precio actual es menor que el original, mostramos ambos
      precioTexto = `<span class="discount-price"><del>${EUR.format(this.precioOriginal)}</del> ${EUR.format(this.precio)} 🔥</span>`;
    }

   return `
        <div class="product-info">
            <img src="${this.imagen}" alt="${this.nombre}" class="product-image">
            <div class="product-details">
                <h4>${this.nombre}</h4>
                ${estadisticaPrincipal}
                <p class="product-price">${precioTexto}</p>
            </div>
        </div>
    `;
  }

  /**
   * Aplica un descuento al producto y devuelve una nueva instancia con el precio actualizado.
   * @param {number} porcentaje - Porcentaje de descuento (0–100).
   * @returns {Producto} Un nuevo producto con el precio reducido.
   */
  aplicarDescuento(porcentaje) {
    // Limita el porcentaje entre 0 y 100
    if (porcentaje < 0) porcentaje = 0;
    if (porcentaje > 100) porcentaje = 100;

    // Calcula el nuevo precio (Ejemplo: 200 * (1 - 0.25))
    const nuevoPrecio = Math.round(this.precioOriginal * (1 - porcentaje / 100));

    return new Producto(this.nombre, nuevoPrecio, this.rareza, this.tipo, this.bonus, this.imagen, this.precioOriginal);
  }
}
