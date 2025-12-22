import { groupBy } from '../utils/utils.js';

/**
 * Módulo de Ranking y Batalla
 * ----------------------------
 * Gestiona el sistema de combate entre jugadores y enemigos,
 * agrupa jugadores según su nivel y muestra el ranking final.
 */

/**
 * Simula una batalla entre un jugador y un enemigo.
 * Si el jugador gana, obtiene puntos según la fuerza del enemigo.
 * @param {Jugador} jugador - Jugador participante.
 * @param {Enemigo} enemigo - Enemigo a combatir.
 * @returns {Object} Resultado con el nombre del ganador y los puntos ganados.
 */
export function batalla(jugador, enemigo) {
  let historialBatallas = [];
  let turno = 1;
  // Copiamos las vidas actuales (sin modificarlas directamente)
  let vidaJugador = jugador.vida;
  let vidaEnemigo = enemigo.vida;

  historialBatallas.push(`Comienza la batalla contra ${enemigo.nombre}`);

  while (vidaJugador > 0 && vidaEnemigo > 0) {
    historialBatallas.push(`--- Turno ${turno} --- `);

    vidaEnemigo -= jugador.ataqueTotal;
    if (vidaEnemigo < 0) vidaEnemigo = 0;
    historialBatallas.push(`${jugador.nombre} hace ${jugador.ataqueTotal} de daño. Vida del enemigo: ${vidaEnemigo}`);

    if (vidaEnemigo <= 0) break;

    // Ataca el enemigo -> Aquí va tu adaptación
    let dañoBaseEnemigo = enemigo.ataque;
    let defensaJugador = jugador.defensaTotal;
    let danioNetoRecibido = dañoBaseEnemigo - defensaJugador;
    if (danioNetoRecibido < 0) danioNetoRecibido = 0;

    vidaJugador -= danioNetoRecibido;
    if (vidaJugador < 0) vidaJugador = 0;

    historialBatallas.push(`${enemigo.nombre} hace ${danioNetoRecibido} de daño. Vida del jugador: ${vidaJugador}`);

    turno++;
  }

  let ganador;
  if (vidaJugador > 0) {
    ganador = jugador.nombre;
  } else {
    ganador = enemigo.nombre;
  }


  let puntosGanados = 0;
  let dineroGanado = 0;
  if (ganador === jugador.nombre) {
    puntosGanados = 100 + enemigo.ataque;
    if (enemigo.tipo === "jefe")  {
      puntosGanados *= enemigo.multiplicador;
      dineroGanado = 10;
    }else{
      dineroGanado = 5;
    }
  
  }
  // Suma los puntos al jugador
  jugador.puntos += puntosGanados;

  return {
    historialBatallas: historialBatallas,
    ganador: ganador,
    puntosGanados: puntosGanados, 
    dineroGanado: dineroGanado
  };

}


/**
* Agrupa jugadores según su puntuación:
* - "pro" si superan el umbral.
* - "rookie" si no lo alcanzan.
*
* @param {Array<Jugador>} jugadores - Lista de jugadores.
* @param {number} [umbral=300] - Puntos mínimos para ser "pro", por defecto 300.
* @returns {Object} Jugadores agrupados por nivel.
*/
export function agruparPorNivel(jugadores, umbral = 300) {
  return groupBy(jugadores, jugador => (jugador.puntos >= umbral ? 'pro' : 'rookie'));
}

/**
 * Muestra el ranking final de jugadores en consola,
 * ordenados por puntuación de mayor a menor.
 * @param {Array<Jugador>} jugadores - Lista de jugadores.
 */
export function mostrarRanking(jugadores) {
  // Ordena de mayor a menor puntuación
  const ordenados = jugadores.slice().sort((a, b) => b.puntos - a.puntos);

  console.log('🏆 RANKING FINAL 🏆');
  for (const jugador of ordenados) {
    console.log(jugador.mostrarJugador());
  }
}


