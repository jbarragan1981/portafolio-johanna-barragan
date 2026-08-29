# Portafolio Personal

## Estudiante
Johanna Barragán Arteaga

## Descripción
Sitio web que funciona como portafolio personal. Presenta información básica,
habilidades, proyectos desarrollados y una sección de contacto. El diseño utiliza
una paleta inspirada en los colores de marca de LinkedIn.

Desarrollado en dos etapas. La primera construyó la estructura y los estilos con
HTML y CSS. La segunda incorporó JavaScript para volverlo interactivo, con
persistencia de preferencias en el navegador y envío real del formulario de
contacto.

## Secciones
- **Inicio.** Título principal, descripción breve y fotografía.
- **Sobre mí.** Trayectoria, intereses y objetivos profesionales, con una ficha de datos.
- **Habilidades.** Seis áreas de trabajo con las herramientas usadas en cada una.
- **Proyectos.** Cuatro trabajos con nombre, descripción, imagen y enlace.
- **Contacto.** Formulario validado con nombre, correo y mensaje, más el enlace a LinkedIn.

## Funcionalidades con JavaScript

### Modo oscuro
Botón en el encabezado que alterna entre tema claro y oscuro. El cambio se aplica
escribiendo un atributo `data-tema` en la etiqueta `<html>`; el CSS redefine ahí las
variables de color y toda la hoja de estilos responde sola.

La elección se guarda en `localStorage` bajo la clave `portafolio-tema` y se recupera
al volver a abrir la página. Si no hay ninguna preferencia guardada, se consulta la
configuración del sistema operativo mediante `prefers-color-scheme`.

### Proyectos favoritos
Cada tarjeta de proyecto tiene una estrella. Al pulsarla, el proyecto se agrega o se
quita de una lista guardada en `localStorage` bajo la clave `portafolio-favoritos`.

Al recargar, las estrellas marcadas se restauran y aparece un resumen con la cantidad
de proyectos guardados. Cada proyecto se identifica con un atributo `data-proyecto`,
de modo que la selección se mantiene aunque cambie el orden de las tarjetas.

### Validación del formulario
Antes de enviar se comprueba que nombre, correo y mensaje no estén vacíos y que el
correo tenga un formato válido. Cada campo con problema se marca en rojo y muestra
su propio mensaje, que desaparece en cuanto el visitante empieza a corregir.

### Envío del formulario
Si la validación pasa, los datos viajan mediante `fetch` a un webhook de n8n que
valida nuevamente la información y envía el correo. El visitante no sale de la
página: el botón se bloquea mientras el mensaje viaja y al terminar aparece la
confirmación.

El formulario incluye un campo trampa oculto contra robots de spam.

### Botón volver arriba
Botón flotante que aparece al bajar más de 400 píxeles y devuelve la vista al inicio.

### Año dinámico
El año del pie de página se toma de la fecha del sistema.

## Eventos utilizados
| Evento | Dónde |
|---|---|
| `click` | Botón de tema, botón de subir y estrellas de cada proyecto |
| `scroll` | Ventana, para mostrar u ocultar el botón de subir |
| `submit` | Formulario de contacto |
| `input` | Campos del formulario, para limpiar los errores |

## Tecnologías utilizadas
- HTML5 con etiquetas semánticas (`header`, `nav`, `main`, `section`, `article`,
  `figure`, `form`, `aside`, `footer`)
- CSS3 con variables en `:root`, Flexbox, pseudoclase `:hover` y consultas de medios
- JavaScript sin librerías: manipulación del DOM, `addEventListener`, `localStorage`
  y `fetch`
- n8n como servicio externo de automatización que recibe el formulario y envía el correo
- Iconos en SVG escritos a mano, sin librerías externas
- Git y GitHub para el control de versiones

## Estructura del proyecto
```
portafolio-johanna-barragan/
├── index.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   └── script.js
└── img/
    ├── foto-linkedin.jpg
    ├── proyecto-agente-ia.jpg
    ├── proyecto-formacion.jpg
    ├── proyecto-murano.jpg
    └── proyecto-vui.jpg
```

## Instrucciones para ejecutar el proyecto
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/jbarragan1981/portafolio-johanna-barragan.git
   ```
2. Entrar a la carpeta del proyecto.
3. Abrir el archivo `index.html` en cualquier navegador web.

No requiere instalación de dependencias ni servidor local. El modo oscuro y los
favoritos funcionan al abrir el archivo directamente.

El envío del formulario necesita conexión a internet, ya que consulta un servicio
externo. Si el servicio no responde, se muestra un mensaje de error sin perder lo
escrito.

## Versión publicada
https://jbarragan1981.github.io/portafolio-johanna-barragan/

## Captura de pantalla
![Vista del portafolio en el navegador](img/captura-portafolio.png)

## Autora
Johanna Barragán Arteaga · 2026
[GitHub](https://github.com/jbarragan1981) ·
[LinkedIn](https://www.linkedin.com/in/johannabarragan/)