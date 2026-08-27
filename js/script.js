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
   5. EVENTOS
   -------------------------------------------- */

document.getElementById("botonTema").addEventListener("click", alternarTema);
document.getElementById("botonArriba").addEventListener("click", subirAlInicio);
window.addEventListener("scroll", actualizarBotonArriba);

/* --------------------------------------------
   6. ARRANQUE
   -------------------------------------------- */

mostrarAnioActual();
recuperarTemaGuardado();
actualizarBotonArriba();