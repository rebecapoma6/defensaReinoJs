/**
 * Agrupa los elementos de un array según una función de selección.
 *
 * @param {Array} array - Lista de elementos a agrupar.
 * @param {Function} selectorFn - Función que indica por qué propiedad agrupar.
 * @returns {Object} Un objeto con los grupos.
 * @example
 * groupBy(
 *   [{ tipo: 'arma' }, { tipo: 'poción' }, { tipo: 'arma' }],
 *   item => item.tipo
 * );
 * // Devuelve: { arma: [...], poción: [...] }
 */
export function groupBy(array, selectorFn) {
    const grouped = {};
    // Recorremos cada elemento del array
    for (const item of array) {
        // Obtenemos la clave del grupo usando la función pasada como parámetro
        const key = selectorFn(item);
        // Si el grupo aún no existe dentro del objeto, lo inicializamos como un array vacío
        if (!grouped[key]) {
            grouped[key] = [];
        }
        // Añadimos el elemento actual dentro del grupo correspondiente
        grouped[key].push(item);
        console.log(grouped)

    }
    return grouped;
}

/**
 * Formateador de números a euros según la convención española.
 * Intl.NumberFormat() clase de JS para formatear números
 * @example
 * EUR.format(1500); // "1.500,00 €"
 */
export const EUR = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
});

/**
 * 
 * @param {object} jugador - valida si el jugador esta definido o es null se detiene la funcion
 * @param {number} num - busca el ids con los numeros indicados en el html
 * @returns 
 */

export function actualizarFormulario(jugador, num) {

    if (!jugador) return;

    const imagen = document.getElementById(`imgJugadorScene-${num}`);
    const nombre = document.getElementById(`nameJugadorScene-${num}`);
    const ataque = document.getElementById(`atak-${num}`);
    const defensa = document.getElementById(`def-${num}`);
    const vida = document.getElementById(`hp-${num}`);
    const puntos = document.getElementById(`pts-${num}`);

    if (imagen) imagen.src = jugador.avatar;
    if (nombre) nombre.textContent = jugador.nombre;
    if (ataque) ataque.textContent = jugador.ataqueTotal;
    if (defensa) defensa.textContent = jugador.defensaTotal;
    if (vida) vida.textContent = `${jugador.vidaActual}/${jugador.vidaTotal}`;
    if (puntos) puntos.textContent = jugador.puntos;

}
