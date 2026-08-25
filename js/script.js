/* --------------------------------------------
   1. AÑO ACTUAL EN EL PIE DE PÁGINA
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

mostrarAnioActual();