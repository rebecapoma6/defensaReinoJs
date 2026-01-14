import { groupBy } from '../utils/utils.js';

/**
 * Módulo de Ranking y Batalla
 * ----------------------------
 * Gestiona el sistema de combate entre jugadores y enemigos,
 * agrupa jugadores según su nivel y muestra el ranking final.
 */


const rankingReino = "aventuraJS"



/**
 * He creado 10 registros de jugadores.
 */
const PARTIDAS_POR_DEFECTO=[
  { nombre: "Sir Galahad", puntuacion: 2500, monedas: 600 },
    { nombre: "Rey Arturo", puntuacion: 2200, monedas: 800 },
    { nombre: "Lancelot", puntuacion: 1950, monedas: 450 },
    { nombre: "Percival", puntuacion: 1800, monedas: 300 },
    { nombre: "Gawain", puntuacion: 1650, monedas: 250 },
    { nombre: "Bors", puntuacion: 1400, monedas: 200 },
    { nombre: "Tristán", puntuacion: 1250, monedas: 150 },
    { nombre: "Bedivere", puntuacion: 1100, monedas: 100 },
    { nombre: "Kay", puntuacion: 950, monedas: 80 },
    { nombre: "Mordred", puntuacion: 500, monedas: 50 }
]


/**
 * Simula una batalla entre un jugador y un enemigo.
 * Si el jugador gana, obtiene puntos según la fuerza del enemigo.
 * si la defensa es mayor que el ataque , el daño seria negativo
 * entonces , si es menor que cero , sera obligatoriamente a cero
 * @param {Jugador} jugador - Jugador participante.
 * @param {Enemigo} enemigo - Enemigo a combatir.
 * @returns {Object} Resultado con el nombre del ganador y los puntos ganados.
 */
export function batalla(jugador, enemigo) {
  let historialBatallas = [];
  let turno = 1;
  let vidaJugador = jugador.vidaActual;
  let vidaEnemigo = enemigo.vida;

  historialBatallas.push(`Comienza la batalla contra ${enemigo.nombre}`);

  while (vidaJugador > 0 && vidaEnemigo > 0) {
    historialBatallas.push(`--- Turno ${turno} --- `);

    vidaEnemigo -= jugador.ataqueTotal;
    if (vidaEnemigo < 0) { vidaEnemigo = 0; }
    historialBatallas.push(`${jugador.nombre} hace ${jugador.ataqueTotal} de daño. Vida del enemigo: ${vidaEnemigo}`);

    if (vidaEnemigo <= 0) { break; }

    let danioBaseEnemigo = enemigo.ataque;
    let defensaJugador = jugador.defensaTotal;
    let danioNetoRecibido = danioBaseEnemigo - defensaJugador;

  
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
      puntosGanados = Math.floor(puntosGanados); 
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

/**
 * Guarda los puntos y el dinero del jugador en el almacenamiento del navegador (localStorage).
 * Suma los puntos ganados en batallas y el dinero que sobró para sacar la puntuación final.
 * Prepara un "paquete" con el nombre del jugador, su puntuación y sus monedas.
 * Va al "baúl" (localStorage) a ver si ya hay una lista de ranking guardada de antes.
 * Si el baúl no está vacío, saca la lista y la convierte de texto a algo que JS pueda leer.
 * Mete los datos del nuevo jugador al final de esa lista.
 * Vuelve a guardar la lista actualizada en el "baúl" convirtiéndola de nuevo en texto.
 * @param {Jugador} jugador - El objeto del jugador actual con sus datos.
 */
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
 * Intenta leer los datos de 'aventuraJS' del LocalStorage.
 * Si no hay nada (null), utiliza el texto "[]" como valor por defecto para no romper el programa.
 * Convierte ese texto en una lista real (Array) de js.
 * Combina esa lista con los 10 jugadores xdefecto usando el operador spread (...)
 * Ordena todos los jugadores por puntuación de mayor a menor.
 * @returns {Array} La lista final de jugadores (reales + porDefecto) ordenada.
 */
  export function rankingPorDefecto() {
    const datosOriginales = JSON.parse(localStorage.getItem(rankingReino) || "[]");

    const listaCompleta = [...datosOriginales,...PARTIDAS_POR_DEFECTO];

    return listaCompleta.sort((a,b)=> b.puntuacion - a.puntuacion);
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
 * Muestra el ranking por consola.
 * Usa la función 'rankingPorDefecto' para asegurar que siempre haya datos que ver.
 */
export function mostrarRanking() {
  const ordenados = rankingPorDefecto();
  console.log('🏆 RANKING FINAL 🏆');
  console.table(ordenados);
 
}


