import { groupBy } from '../utils/utils.js';

export class Jugador {
  nombre;
  puntos;
  inventario;
  vidaBase;
  vidaActual;
  avatar;
  ataqueInicio;
  defensaInicio;
  dinero;

  /**
   * Crea una nueva instancia de Jugador.
   * @param {string} nombre - Nombre del jugador.
   */
  constructor(nombre, avatar,ataque,defensa,vidaExtra,dinero = 500) {
    this.nombre = nombre;
    this.avatar = avatar;
    this.ataqueInicio = ataque;
    this.defensaInicio = defensa;
    this.vidaBase = 100 + vidaExtra;
    this.vidaActual = this.vidaBase;
    this.dinero = dinero;
    this.puntos = 0;
    this.inventario = [];
  
   
  }

    /**
   * Calcula el total de ataque del jugador basado en los bonus de sus ítems.
   * @returns {number} Puntos de ataque totales.
   */
  get ataqueTotal() {
     let sumaBonusItems = this.inventario.reduce((total, item) => total + (item.bonus.ataque || 0), 0);
    return this.ataqueInicio + sumaBonusItems
  }

  /**
   * Calcula el total de defensa del jugador basado en los bonus de sus ítems.
   * @returns {number} Puntos de defensa totales.
   */
  get defensaTotal() {
 let sumaBonusItems = this.inventario.reduce((total, item) => total + (item.bonus.defensa || 0), 0);
    return this.defensaInicio + sumaBonusItems;
  }
  /**
   * calcula la vida máxima total incluyendo los bonus de los consumibles.
   * independiente de this.vida, que es la vida actual durante la batalla.
   */
  get vidaTotal() {
     let sumaBonusItems = this.inventario.reduce((total, item) => total + (item.bonus.vida || 0), 0);
    return this.vidaBase + sumaBonusItems
  }

  /**
   * Añade un objeto al inventario del jugador.
   * Se utiliza `structuredClone` para evitar modificar el objeto original.
   * @param {Object} itemComprado - Objeto que se añadirá al inventario.
   */
  añadirItem(itemComprado) {
    this.inventario.push(structuredClone(itemComprado));
   
    if (itemComprado.bonus && itemComprado.bonus.vida) {
        this.vidaActual += itemComprado.bonus.vida;
    }
  }

  /**
   * Incrementa los puntos del jugador.
   * @param {number} cantidad - Cantidad de puntos a añadir.
   */
  ganarPuntos(cantidad) {
    this.puntos += cantidad;
  }

  /**
   * 
   * @param {number} precio - cuanto vale lo que compra
   * @returns {boolean} - Devuelve true si se pudo pagar , o false si no.
   */
  pagarCompra(precio){
    if (this.dinero >= precio) {
        this.dinero -= precio;
        return true;
    }else{
        return false;
    }
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
      🪙 Dinero: ${this.dinero}
      ❤️ Vida: ${this.vidaActual}/${this.vidaTotal}
      ⭐ Puntos: ${this.puntos}
      ⚔️ Ataque total: ${this.ataqueTotal}
      🛡️ Defensa total: ${this.defensaTotal}
      🎒 Inventario: ${this.inventario.length > 0
        ? this.inventario.map(item => item.nombre).join(', ')
        : 'Vacío'}
    `;
  }

}
