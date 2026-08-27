/* ============================================
   PORTAFOLIO PERSONAL - JOHANNA BARRAGÁN
   Comportamiento del sitio
   ============================================ */

/* --------------------------------------------
   1. CONSTANTES GENERALES
   -------------------------------------------- */

/* Clave con la que se guarda el tema en el navegador */
const CLAVE_TEMA = "portafolio-tema";

/* Distancia en píxeles a partir de la cual aparece el botón de subir */
const DESPLAZAMIENTO_MINIMO = 400;

/* Clave con la que se guardan los proyectos marcados */
const CLAVE_FAVORITOS = "portafolio-favoritos";

/* Respeta la preferencia del sistema de reducir animaciones */
const prefiereMenosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* --------------------------------------------
   2. AÑO ACTUAL EN EL PIE DE PÁGINA
   -------------------------------------------- */

/**
 * Escribe el año en curso en el pie de página,
 * para no tener que actualizarlo a mano cada enero.
 */
function mostrarAnioActual() {
    const contenedorAnio = document.querySelector(".pie_anio");

    if (contenedorAnio) {
        const anioActual = new Date().getFullYear();
        contenedorAnio.textContent = anioActual;
    }
}

/* --------------------------------------------
   3. MODO OSCURO
   -------------------------------------------- */

/**
 * Aplica un tema al documento y actualiza el texto del botón.
 * @param {string} tema - "claro" u "oscuro"
 */
function aplicarTema(tema) {
    const botonTema = document.getElementById("botonTema");
    const textoTema = document.getElementById("textoTema");

    document.documentElement.dataset.tema = tema;

    if (tema === "oscuro") {
        textoTema.textContent = "Modo claro";
        botonTema.setAttribute("aria-label", "Activar modo claro");
    } else {
        textoTema.textContent = "Modo oscuro";
        botonTema.setAttribute("aria-label", "Activar modo oscuro");
    }
}

/**
 * Cambia al tema contrario y guarda la elección en el navegador.
 */
function alternarTema() {
    const temaActual = document.documentElement.dataset.tema;
    const temaNuevo = temaActual === "oscuro" ? "claro" : "oscuro";

    aplicarTema(temaNuevo);
    localStorage.setItem(CLAVE_TEMA, temaNuevo);
}

/**
 * Recupera el tema guardado en visitas anteriores.
 * Si no hay ninguno, usa la preferencia del sistema operativo.
 */
function recuperarTemaGuardado() {
    const temaGuardado = localStorage.getItem(CLAVE_TEMA);

    if (temaGuardado) {
        aplicarTema(temaGuardado);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        aplicarTema("oscuro");
    } else {
        aplicarTema("claro");
    }
}

/* --------------------------------------------
   4. BOTÓN VOLVER ARRIBA
   -------------------------------------------- */

/**
 * Muestra u oculta el botón según lo que se haya bajado en la página.
 */
function actualizarBotonArriba() {
    const botonArriba = document.getElementById("botonArriba");

    if (window.scrollY > DESPLAZAMIENTO_MINIMO) {
        botonArriba.classList.add("boton-arriba--visible");
    } else {
        botonArriba.classList.remove("boton-arriba--visible");
    }
}

/**
 * Lleva la vista al inicio de la página.
 */
function subirAlInicio() {
    window.scrollTo({
        top: 0,
        behavior: prefiereMenosMovimiento ? "auto" : "smooth"
    });
}

/* --------------------------------------------
   5. PROYECTOS FAVORITOS
   -------------------------------------------- */

/**
 * Devuelve la lista de proyectos guardados en el navegador.
 * Si el dato está dañado o no existe, devuelve una lista vacía.
 * @returns {string[]}
 */
function obtenerFavoritos() {
    const guardado = localStorage.getItem(CLAVE_FAVORITOS);

    if (!guardado) {
        return [];
    }

    try {
        return JSON.parse(guardado);
    } catch (error) {
        return [];
    }
}

/**
 * Escribe el resumen con la cantidad de proyectos marcados.
 * @param {number} cantidad
 */
function actualizarResumenFavoritos(cantidad) {
    const resumen = document.getElementById("favoritosResumen");

    if (cantidad === 0) {
        resumen.classList.remove("favoritos_resumen--visible");
        resumen.textContent = "";
    } else if (cantidad === 1) {
        resumen.classList.add("favoritos_resumen--visible");
        resumen.textContent = "Tienes 1 proyecto guardado en este navegador.";
    } else {
        resumen.classList.add("favoritos_resumen--visible");
        resumen.textContent = "Tienes " + cantidad + " proyectos guardados en este navegador.";
    }
}

/**
 * Refleja en pantalla el estado de cada tarjeta según la lista guardada.
 */
function pintarFavoritos() {
    const favoritos = obtenerFavoritos();
    const tarjetas = document.querySelectorAll(".proyecto");

    tarjetas.forEach(function (tarjeta) {
        const boton = tarjeta.querySelector(".proyecto_favorito");
        const identificador = tarjeta.dataset.proyecto;
        const estaGuardado = favoritos.includes(identificador);

        boton.setAttribute("aria-pressed", estaGuardado);

        if (estaGuardado) {
            boton.setAttribute("aria-label", "Quitar este proyecto de favoritos");
        } else {
            boton.setAttribute("aria-label", "Guardar este proyecto en favoritos");
        }
    });

    actualizarResumenFavoritos(favoritos.length);
}

/**
 * Agrega o quita un proyecto de la lista y guarda el resultado.
 * @param {string} identificador
 */
function alternarFavorito(identificador) {
    const favoritos = obtenerFavoritos();
    const posicion = favoritos.indexOf(identificador);

    if (posicion === -1) {
        favoritos.push(identificador);
    } else {
        favoritos.splice(posicion, 1);
    }

    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
    pintarFavoritos();
}

/**
 * Conecta el botón de cada tarjeta con la función anterior.
 */
function activarBotonesFavoritos() {
    const botones = document.querySelectorAll(".proyecto_favorito");

    botones.forEach(function (boton) {
        boton.addEventListener("click", function () {
            const tarjeta = boton.closest(".proyecto");
            alternarFavorito(tarjeta.dataset.proyecto);
        });
    });
}

/* --------------------------------------------
   6. EVENTOS
   -------------------------------------------- */

document.getElementById("botonTema").addEventListener("click", alternarTema);
document.getElementById("botonArriba").addEventListener("click", subirAlInicio);
window.addEventListener("scroll", actualizarBotonArriba);
activarBotonesFavoritos();

/* --------------------------------------------
   7. ARRANQUE
   -------------------------------------------- */

mostrarAnioActual();
recuperarTemaGuardado();
actualizarBotonArriba();
pintarFavoritos();