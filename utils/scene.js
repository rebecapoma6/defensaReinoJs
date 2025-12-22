/**
 * Permite mostrar u ocultar un elemento (escena) de la pantalla.
 * Selecciona todos los elementos con la clase 'scene' y les remueve la clase 'active'.
 * Selecciona el elemento con el id especificado y le añade la clase 'active'.
 * @param {string} id - identificador del elemento.
 */
export function showScene(id) {
  document.querySelectorAll('.scene').forEach(element =>
    element.classList.remove('active')
  );
  document.getElementById(id).classList.add('active');
}
