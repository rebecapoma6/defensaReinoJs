import { groupBy } from '../utils/utils.js';

export class Jugador {
  nombre;
  puntos;
  inventario;
  vidaMax;
  vida;

  /**
   * Crea una nueva instancia de Jugador.
   * @param {string} nombre - Nombre del jugador.
   */
  constructor(nombre, avatar) {
    this.nombre = nombre;
    this.avatar = avatar;
    this.puntos = 0;
    this.inventario = [];
    this.vidaMax = 100;
    this.vida = this.vidaMax;
  }

  /**
   * Añade un objeto al inventario del jugador.
   * Se utiliza `structuredClone` para evitar modificar el objeto original.
   * @param {Object} item - Objeto que se añadirá al inventario.
   */
  añadirItem(item) {
    this.inventario.push(structuredClone(item));
    // Actualiza la vida máxima actual si es consumible
    this.vida = this.vidaTotal;
  }

  /**
   * Incrementa los puntos del jugador.
   * @param {number} cantidad - Cantidad de puntos a añadir.
   */
  ganarPuntos(cantidad) {
    this.puntos += cantidad;
  }

  /**
   * Calcula el total de ataque del jugador basado en los bonus de sus ítems.
   * @returns {number} Puntos de ataque totales.
   */
  get ataqueTotal() {
    return this.inventario.reduce((total, item) => total + (item.bonus.ataque || 0), 0);
  }

  /**
   * Calcula el total de defensa del jugador basado en los bonus de sus ítems.
   * @returns {number} Puntos de defensa totales.
   */
  get defensaTotal() {
    return this.inventario.reduce((total, item) => total + (item.bonus.defensa || 0), 0);
  }
  /**
   * calcula la vida máxima total incluyendo los bonus de los consumibles.
   * independiente de this.vida, que es la vida actual durante la batalla.
   */
  get vidaTotal() {
    return this.vidaMax + this.inventario.reduce((total, item) => total + (item.bonus.vida || 0), 0);
  }


  /**
   * Agrupa los ítems del inventario por tipo.
   * @returns {Object} Un objeto con listas de objetos agrupados por tipo.
   */
  inventarioPorTipo() {
    return groupBy(this.inventario, item => item.tipo);
  }

  /**
   * Devuelve una presentación detallada del jugador.
   * @returns {Object} Descripción formateada del jugador.
   */
  mostrarJugador() {
    return `
      👤 ${this.nombre}
      ❤️ Vida: ${this.vida}/${this.vidaMax}
      ⭐ Puntos: ${this.puntos}
      ⚔️ Ataque total: ${this.ataqueTotal}
      🛡️ Defensa total: ${this.defensaTotal}
      🎒 Inventario: ${this.inventario.length > 0
        ? this.inventario.map(item => item.nombre).join(', ')
        : 'Vacío'}
    `;
  }

}
