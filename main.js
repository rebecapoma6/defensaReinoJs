import { Jugador } from "./modules/jugadores.js";
import { Enemigo, JefeFinal } from "./modules/enemigos.js";
import { mercado, aplicarDescuentoPorRareza, obtenerRarezasUnicas } from "./modules/mercado.js"
import { batalla, agruparPorNivel, guardarRakingLocalStore, mostrarRanking } from "./modules/ranking.js";
import { showScene } from "./utils/scene.js";
import { EUR, actualizarFormulario } from "./utils/utils.js";


let jugador;
let mercadoActual;
let cestaDeCompra = [];
let indiceBatlla = 0;
let avatarElegido = null;

const listaEnemigos = [
    new Enemigo('Goblin', 9, 60, 'image/Gobln.jpg'),
    new Enemigo('Orcoh', 6, 50, 'image/Orcoh.jpg'),
    new JefeFinal('Dragón Rojo', 30, 120, 'Llama infernal', 1.8, 'image/dragon.jpg'),
];


document.querySelectorAll('.selectable').forEach(img => {
    img.addEventListener('click', (event) => {
        document.querySelectorAll('.selectable').forEach(i => i.classList.remove('selected'));
        event.target.classList.add('selected');
        avatarElegido = event.target.dataset.avatar;
    });
});

/**
 * Escena-1 -> Creacion de Jugador
 */
document.getElementById('btn-create-player').addEventListener('click', () => {

    const nombreJugador = document.getElementById('player-name-input').value.trim();
    const atak = parseInt(document.getElementById('input-atk').value) || 0;
    const def = parseInt(document.getElementById('input-def').value) || 0;
    const vida = parseInt(document.getElementById('input-hp').value) || 100;

    const regexName = /^[A-Z][a-zA-Z\s]{0,19}$/;
    const NAME_INVALID = "El nombre debe empezar con Mayúscula y tener máximo 20 caractereS.";
    const PUNTOS_INVALID = "Solo puedes repartir un máximo de 10 puntos extra entre tus estadísticas";


    if (!regexName.test(nombreJugador)) {
        return alert(NAME_INVALID);
    }
    if (atak + def + (vida - 100) > 10) {
        return alert(PUNTOS_INVALID);
    }
    if (!avatarElegido) {
        return alert("Seleccione un avatar para el juego.")
    }


    jugador = new Jugador(nombreJugador, avatarElegido, atak, def, vida, 500);
    actualizarFormulario(jugador, 2);
    actualizarMonedero();
    showScene("scene-2");

})

/**
 * Escena 2 ---> iremos a Mercado escena-3
 */
document.getElementById('btn-to-market').addEventListener('click', () => {
    const rarezas = obtenerRarezasUnicas();
    const rarezaElegida = rarezas[0];
    const descuentoPorcentaje = 20;
    mercadoActual = aplicarDescuentoPorRareza(rarezaElegida, descuentoPorcentaje);

    mostrarMercado();
    showScene('scene-3');

});


function mostrarMercado() {
    const contenedorMercado = document.getElementById('market-container');
    const totalCesta = cestaDeCompra.reduce((acumulador, product) => {
        return acumulador + product.precio;
    }, 0);

    document.getElementById('basket-total').textContent = `Total: ${EUR.format(totalCesta)}`;
    actualizarMonedero(totalCesta);

    contenedorMercado.innerHTML = mercadoActual.map((prod, i) => {
        const enCestaActual = cestaDeCompra.some(pdto => pdto.nombre === prod.nombre);
        return `
        <div class="producto-card" ${enCestaActual ? 'added' : ''}>
        ${prod.mostrarProducto()}
        <button class="btn-mercado" data-indice="${i}">${enCestaActual ? 'Quitar' : 'Añadir'}</button>
        </div>
        `;
    }).join('');
    contenedorMercado.querySelectorAll('.btn-mercado').forEach(btnMercado => {
        btnMercado.addEventListener('click', () => actualizarCesta(parseInt(btnMercado.dataset.indice)))
    })
}


function actualizarCesta(inc) {
    const productSelec = mercadoActual[inc];
    const enCestaInc = cestaDeCompra.findIndex(p => p.nombre === productSelec.nombre);
    if (enCestaInc > -1) {
        cestaDeCompra.splice(enCestaInc, 1);
    } else {
        const totalActual = cestaDeCompra.reduce((acc, p) => acc + p.precio, 0);

        if (totalActual + productSelec.precio > jugador.dinero) {
            return alert("Oro insuficiente para comprar productos.");
        }
        cestaDeCompra.push(productSelec);
    }

    mostrarMercado();
    actualizarfooter();
}



/** Escena 3 -> iremos al formulario actulizado escena-4 */
document.getElementById('btn-to-battle').addEventListener('click', () => {
    const totalCompra = cestaDeCompra.reduce((acumulador, producto) => acumulador + producto.precio, 0);
    if (jugador.pagarCompra(totalCompra)) {
        cestaDeCompra.forEach(item => jugador.añadirItem(item));
        actualizarFormulario(jugador, 4);
        actualizarMonedero();
        actualizarfooter();
        showScene('scene-4');
    }
});



document.getElementById('btn-to-enemies').addEventListener('click', () => {
    const contenedorEnemigos = document.getElementById('enemies-container');
    contenedorEnemigos.innerHTML = listaEnemigos.map(enmigo => `
        <div class="enemy-card">
        <img src="${enmigo.imagen}">
        <h3>${enmigo.nombre}</h3>
        <p>${enmigo.ataque}ATK</p>
        </div>        
        `).join('');
    showScene('scene-5');
});


/**
 * Combate - Iniciaremos los combates 
 */
document.getElementById('btn-to-combat').addEventListener('click', () => {
    indiceBatlla = 0;
    generarBatallaActual();
    showScene('scene-6');
});




/**
 * Monedas - mostraremos las monedas , cuando haya un ganador
 */
function mostraMonedasAnimadas() {
    const monedasAnimadas = ` 
    <img src="image/moneda.png" alt="moneda" class="moneda">
    <img src="image/moneda.png" alt="moneda" class="moneda">
    <img src="image/moneda.png" alt="moneda" class="moneda">
    `;
    document.body.insertAdjacentHTML('beforeend', monedasAnimadas);

    setTimeout(() => {
        document.querySelectorAll('.moneda').forEach(m => m.remove());
    }, 3500); //3.5 segundos que espere antes de remover las monedas
}



/**
 * 
 */
async function generarBatallaActual() {
    if (indiceBatlla >= listaEnemigos.length) {
        verResultadoFinal();
        return;
    }

    const rival = listaEnemigos[indiceBatlla];
    const resultadoGandor = batalla(jugador, rival);
    document.getElementById("battle-player-img").src = jugador.avatar;
    document.getElementById("battle-player-name").textContent = jugador.nombre;
    document.getElementById("battle-enemy-img").src = rival.imagen;
    document.getElementById("battle-enemy-name").textContent = rival.nombre;

    if (resultadoGandor.ganador === jugador.nombre) {
        mostraMonedasAnimadas();
    }

    document.getElementById('battle-output').innerHTML = `
    <p>Ganador: <strong>${resultadoGandor.ganador}</strong></p>
    <p>Puntos ganados: <strong>${resultadoGandor.puntosGanados}</strong></p>
    `;

    await new Promise(r => setTimeout(r, 800));

    actualizarMonedero();
    indiceBatlla++;

    if (indiceBatlla >= listaEnemigos.length) {
        document.getElementById('btn-next-battle').textContent = "Resultados Finales"
    }
}

document.getElementById('btn-next-battle').addEventListener('click', generarBatallaActual);






/**
 * 
 */
function verResultadoFinal() {
    showScene('scene-7');
    const nivel = agruparPorNivel([jugador], 250);
    let mensajeNivel;
    let puntuacionFinal = jugador.puntos + jugador.dinero;

    if (nivel.pro && nivel.pro.length > 0) {
        mensajeNivel = '🏆 Eres un VETERANO 🏆';
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

    } else {
        mensajeNivel = '💀 Novato 💀'
    }

    const contendorMensaje = document.getElementById('result-message');
    if (contendorMensaje) {
        contendorMensaje.innerHTML = `
      <h2>${mensajeNivel}</h2>
      <p>Tus puntos totales: <strong>${puntuacionFinal}</strong></p>
    `;
    }
    guardarRakingLocalStore(jugador);

}




/**
 * Escena 8 -Ranking 
 * 
 */
document.getElementById('btn-show-ranking').addEventListener('click', () => {
    const tbody = document.getElementById('ranking-body');
    const datos = JSON.parse(localStorage.getItem("aventuraJS") || "[]");
    datos.sort((a, b) => b.puntuacion - a.puntuacion);
    tbody.innerHTML = datos.map(d => `<tr><td>${d.nombre}</td><td>${d.puntuacion}</td><td>${EUR.format(d.monedas)}</td></tr>`).join('');
    showScene('scene-8');
});

document.getElementById('btn-verRanking').addEventListener('click', ()=>{
    mostrarRanking();
})



function actualizarfooter() {
    const invntFootr = document.querySelectorAll('.foo-product');
    invntFootr.forEach(f => f.innerHTML = '');
    const items = (jugador && jugador.inventario.length > 0) ? jugador.inventario : cestaDeCompra;

    items.forEach((p, i) => {
        if (invntFootr[i]) {
            invntFootr[i].innerHTML = `<img src="${p.imagen}" alt="${p.nombre}">`;
        }
    });

}


function actualizarMonedero(desc = 0) {
    document.getElementById('cantidad-dinero').textContent = jugador.dinero - desc;
}


document.getElementById('btn-restart').addEventListener('click', () => location.reload());


