import { groupBy } from '../utils/utils.js';

/**
 * Módulo de Ranking y Batalla
 * ----------------------------
 * Gestiona el sistema de combate entre jugadores y enemigos,
 * agrupa jugadores según su nivel y muestra el ranking final.
 */


const rankingReino = "aventuraJS"
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
  let vidaJugador = jugador.vidaActual;
  let vidaEnemigo = enemigo.vida;

  historialBatallas.push(`Comienza la batalla contra ${enemigo.nombre}`);

  while (vidaJugador > 0 && vidaEnemigo > 0) {
    historialBatallas.push(`--- Turno ${turno} --- `);

    vidaEnemigo -= jugador.ataqueTotal;
    if (vidaEnemigo < 0) { vidaEnemigo = 0; }
    historialBatallas.push(`${jugador.nombre} hace ${jugador.ataqueTotal} de daño. Vida del enemigo: ${vidaEnemigo}`);

    if (vidaEnemigo <= 0) { break; }

    /**   
     * Ataque del enemigo hacia el jugador
     */
    let danioBaseEnemigo = enemigo.ataque;
    let defensaJugador = jugador.defensaTotal;
    let danioNetoRecibido = danioBaseEnemigo - defensaJugador;

    /**
     * si la defensa es mayor que el ataque , el daño seria negativo
     * entonces , si es menor que cero , sera obligatoriamente a cero
     */
    if (danioNetoRecibido < 0) { danioNetoRecibido = 0; }

    vidaJugador -= danioNetoRecibido;

    if (vidaJugador < 0) { vidaJugador = 0; }

    historialBatallas.push(`${enemigo.nombre} hace ${danioNetoRecibido} de daño. Vida del jugador ${jugador.nombre}: ${vidaJugador}`);

    turno++;
  }

  let jugadorWin = "";
  if (vidaJugador > 0) {
    jugadorWin = jugador.nombre;
  } else {
    jugadorWin = enemigo.nombre;
  }

  let puntosGanados = 0;
  let dineroGanado = 0;

  if (jugadorWin === jugador.nombre) {
    puntosGanados = 100 + enemigo.ataque;
    if (enemigo.tipo === "jefe") {
      puntosGanados *= enemigo.multiplicador;
      puntosGanados = Math.floor(puntosGanados); //quitamos los decimales para q el numero sea entero
      dineroGanado = 10;
    } else {
      dineroGanado = 5;
    }
    jugador.puntos += puntosGanados;
    jugador.dinero += dineroGanado;

    jugador.vidaActual = vidaJugador;
  }

  return {
    historialBatallas: historialBatallas,
    ganador: jugadorWin,
    puntosGanados: puntosGanados,
    dineroGanado: dineroGanado
  };

}

export function guardarRakingLocalStore(jugador) {

  let puntuacionFinal = jugador.puntos + jugador.dinero;
  let guardarDatosLocal = {
    nombre: jugador.nombre,
    puntuacion: puntuacionFinal,
    monedas: jugador.dinero
  }

  let rankingGuardado = localStorage.getItem(rankingReino);
  let listadoRanking = [];
  if (rankingGuardado !== null) {
    listadoRanking = JSON.parse(rankingGuardado);
  }
  listadoRanking.push(guardarDatosLocal);
  localStorage.setItem(rankingReino, JSON.stringify(listadoRanking));
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


export function mostrarRanking() {
  let datos = localStorage.getItem(rankingReino);
  let listadoParaVer = [];

  if (datos !== null) {
    listadoParaVer = JSON.parse(datos);
  }
  // Ordena de mayor a menor puntuación
  //const ordenados = jugadores.slice().sort((a, b) => b.puntos - a.puntos);
  const ordenados = listadoParaVer.slice().sort((a, b) => b.puntuacion - a.puntuacion);
  console.log('🏆 RANKING FINAL 🏆');
  if (ordenados.length > 0) {
    console.table(ordenados);
  } else {
    console.log("No hay partidas en el historial.")
  }
}


