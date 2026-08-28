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

/* Webhook de n8n que recibe el formulario y envía el correo.
   Es la URL de producción: el flujo debe estar activo en n8n. */
const ENDPOINT_FORMULARIO = "https://jbarragan149.app.n8n.cloud/webhook/portafolio-contacto";

/* Patrón mínimo de un correo: algo, arroba, dominio y extensión */
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
   6. VALIDACIÓN DEL FORMULARIO
   -------------------------------------------- */

/**
 * Muestra un mensaje de error bajo un campo y lo marca en rojo.
 * @param {HTMLElement} campo
 * @param {HTMLElement} contenedorError
 * @param {string} texto
 */
function mostrarError(campo, contenedorError, texto) {
    campo.classList.add("campo_control--invalido");
    campo.setAttribute("aria-invalid", "true");
    contenedorError.textContent = texto;
    contenedorError.classList.add("campo_error--visible");
}

/**
 * Quita el error de un campo.
 * @param {HTMLElement} campo
 * @param {HTMLElement} contenedorError
 */
function limpiarError(campo, contenedorError) {
    campo.classList.remove("campo_control--invalido");
    campo.removeAttribute("aria-invalid");
    contenedorError.textContent = "";
    contenedorError.classList.remove("campo_error--visible");
}

/**
 * Escribe el mensaje general que aparece bajo el botón de enviar.
 * @param {string} texto
 * @param {string} tipo - "exito" o "error"
 */
function mostrarMensajeGeneral(texto, tipo) {
    const mensaje = document.getElementById("mensajeFormulario");

    mensaje.textContent = texto;
    mensaje.classList.add("formulario_mensaje--visible");

    if (tipo === "exito") {
        mensaje.classList.add("formulario_mensaje--exito");
        mensaje.classList.remove("formulario_mensaje--error");
    } else {
        mensaje.classList.add("formulario_mensaje--error");
        mensaje.classList.remove("formulario_mensaje--exito");
    }
}

/**
 * Revisa los tres campos y devuelve si el formulario puede enviarse.
 * @returns {boolean}
 */
function validarFormulario() {
    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const mensaje = document.getElementById("mensaje");

    const errorNombre = document.getElementById("errorNombre");
    const errorCorreo = document.getElementById("errorCorreo");
    const errorMensaje = document.getElementById("errorMensaje");

    let esValido = true;

    limpiarError(nombre, errorNombre);
    limpiarError(correo, errorCorreo);
    limpiarError(mensaje, errorMensaje);

    if (nombre.value.trim() === "") {
        mostrarError(nombre, errorNombre, "Escribe tu nombre.");
        esValido = false;
    }

    if (correo.value.trim() === "") {
        mostrarError(correo, errorCorreo, "Escribe tu correo electrónico.");
        esValido = false;
    } else if (!PATRON_CORREO.test(correo.value.trim())) {
        mostrarError(correo, errorCorreo, "Revisa el formato del correo, por ejemplo nombre@empresa.com");
        esValido = false;
    }

    if (mensaje.value.trim() === "") {
        mostrarError(mensaje, errorMensaje, "Cuéntame en qué puedo ayudarte.");
        esValido = false;
    }

    return esValido;
}

/**
 * Bloquea o libera el botón mientras el mensaje viaja.
 * @param {boolean} enviando
 */
function marcarEnvioEnCurso(enviando) {
    const boton = document.querySelector("#formularioContacto .boton");

    boton.disabled = enviando;
    boton.textContent = enviando ? "Enviando..." : "Enviar mensaje";
}

/**
 * Envía el formulario al servicio de correo sin recargar la página.
 */
function enviarCorreo() {
    const formulario = document.getElementById("formularioContacto");

    const datos = {
        nombre: document.getElementById("nombre").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        mensaje: document.getElementById("mensaje").value.trim(),
        sitioWeb: document.getElementById("sitioWeb").value.trim(),
        origen: window.location.href
    };

    marcarEnvioEnCurso(true);
    mostrarMensajeGeneral("Enviando tu mensaje...", "exito");

    /* Se envía como texto plano a propósito: evita la petición previa
       de tipo OPTIONS que el navegador hace con application/json.
       En n8n el contenido llega igual y se interpreta como JSON. */
    fetch(ENDPOINT_FORMULARIO, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=UTF-8"
        },
        body: JSON.stringify(datos)
    })
        .then(function (respuesta) {
            if (!respuesta.ok) {
                throw new Error("El servicio respondió con error");
            }
            return respuesta.text();
        })
        .then(function () {
            mostrarMensajeGeneral("Mensaje enviado. Te responderé al correo que dejaste.", "exito");
            formulario.reset();
        })
        .catch(function () {
            mostrarMensajeGeneral("No se pudo enviar el mensaje. Inténtalo en unos minutos o escríbeme por LinkedIn.", "error");
        })
        .finally(function () {
            marcarEnvioEnCurso(false);
        });
}

/**
 * Se ejecuta al enviar el formulario.
 * @param {Event} evento
 */
function enviarFormulario(evento) {
    evento.preventDefault();

    if (validarFormulario()) {
        enviarCorreo();
    } else {
        mostrarMensajeGeneral("Revisa los campos marcados antes de enviar.", "error");
    }
}

/**
 * Borra la marca de error de un campo en cuanto el visitante lo corrige.
 */
function activarLimpiezaDeErrores() {
    const campos = [
        { campo: "nombre", error: "errorNombre" },
        { campo: "correo", error: "errorCorreo" },
        { campo: "mensaje", error: "errorMensaje" }
    ];

    campos.forEach(function (par) {
        const campo = document.getElementById(par.campo);
        const contenedorError = document.getElementById(par.error);

        campo.addEventListener("input", function () {
            if (campo.value.trim() !== "") {
                limpiarError(campo, contenedorError);
            }
        });
    });
}

/* --------------------------------------------
   7. EVENTOS
   -------------------------------------------- */

document.getElementById("botonTema").addEventListener("click", alternarTema);
document.getElementById("botonArriba").addEventListener("click", subirAlInicio);
document.getElementById("formularioContacto").addEventListener("submit", enviarFormulario);
window.addEventListener("scroll", actualizarBotonArriba);
activarBotonesFavoritos();
activarLimpiezaDeErrores();

/* --------------------------------------------
   8. ARRANQUE
   -------------------------------------------- */

mostrarAnioActual();
recuperarTemaGuardado();
actualizarBotonArriba();
pintarFavoritos();