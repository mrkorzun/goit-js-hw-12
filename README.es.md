# Integración con REST API: Async/Await, Axios y Paginación

**🌐 Idioma:** [English](./README.md) · [Українська](./README.ua.md) ·
[Русский](./README.ru.md) · **Español** · [العربية](./README.ar.md)

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Pixabay API](https://img.shields.io/badge/Pixabay-API-2EC66D?style=flat-square&logo=pixabay&logoColor=white)
![Async/Await](https://img.shields.io/badge/async%2Fawait-modern-success?style=flat-square)
![Prettier](https://img.shields.io/badge/Prettier-formatted-F7B93E?style=flat-square&logo=prettier&logoColor=black)

> Una demostración práctica de la **interacción cliente-servidor moderna**:
> consumo de una API REST pública con Axios, manejo de flujos asíncronos
> mediante `async/await`, implementación de paginación y estructuración del
> código con una clara separación de responsabilidades entre las capas de datos,
> vista y controlador.

🔗 **Demo en vivo:**
[mrkorzun.github.io/pixabay-image-search](https://mrkorzun.github.io/pixabay-image-search/)

![Preview](./preview.jpg)

---

## 🎯 Qué demuestra este proyecto

Una aplicación de búsqueda de imágenes construida sobre la **API REST de
Pixabay**. El usuario introduce una palabra clave, la app obtiene fotos desde un
servicio real de terceros, pagina los resultados mediante un botón "Load more" y
permite previsualizar imágenes a tamaño completo en un lightbox. Más allá de las
funcionalidades visibles, el proyecto está estructurado en torno a **patrones
tipo producción** — arquitectura modular de archivos, capa API dedicada, capa de
vista y un controlador que las conecta.

| Capa                                      | Responsabilidad                                     |
| ----------------------------------------- | --------------------------------------------------- |
| **Capa API** (`pixabay-api.js`)           | Toda la comunicación HTTP con Pixabay               |
| **Capa de vista** (`render-functions.js`) | Renderizado del DOM, estado de la galería, lightbox |
| **Controlador** (`main.js`)               | Lógica de negocio, manejo de eventos, orquestación  |

Es la misma separación que verías en cualquier app basada en frameworks —
implementada aquí en JavaScript puro para demostrar que los fundamentos están
sólidos.

---

## 💡 Habilidades y competencias

### 🔹 Consumo de API REST

- Trabajo con una API pública real (**Pixabay**) — leer documentación, construir
  query strings, manejar respuestas.
- Parámetros de query requeridos: `key`, `q`, `image_type`, `orientation`,
  `safesearch`, `per_page`, `page`.
- Parseo de respuestas JSON estructuradas extrayendo solo los campos que la UI
  realmente necesita.
- Manejo defensivo de `totalHits` para detectar el final de la colección.

### 🔹 Cliente HTTP — Axios

- **Axios** como capa HTTP en lugar de `fetch` crudo — parseo JSON automático,
  mejor semántica de errores.
- Configuración de la petición mediante un objeto `params` (sin construir
  manualmente el query string).
- Acceso centralizado a la API a través de una única función exportada — el
  resto de la app nunca toca Axios directamente.

### 🔹 JavaScript Asíncrono — async/await

- Refactor de una implementación previa con `.then()/.catch()` a la sintaxis
  moderna **async/await**.
- Bloques `try/catch/finally` para manejo limpio de errores y desmontaje
  garantizado del loader.
- Conciencia del compromiso: `async/await` se lee de arriba abajo, pero los
  rechazos siguen necesitando manejo explícito.

### 🔹 Patrón de paginación

- Contador de página (`page`) en estado a nivel de módulo.
- Reset a `1` en cada nueva búsqueda — nunca se pagina sobre resultados
  obsoletos.
- El botón "Load more" incrementa la página y **agrega** nuevas tarjetas en
  lugar de reemplazarlas.
- Detección del fin de colección mediante `totalHits` con un mensaje al usuario.

### 🔹 Arquitectura modular

- **Separación de responsabilidades**: API (datos), render (vista), main
  (controlador).
- ES Modules con `import`/`export` explícitos — sin globales, sin dependencias
  implícitas.
- Cada módulo tiene una sola responsabilidad y una API pública clara.

### 🔹 Calidad UX

- **Loader** durante las peticiones — la UI nunca se siente congelada.
- **Scroll suave** vía `window.scrollBy` después de cada "Load more" —
  auto-posiciona al usuario en las tarjetas recién cargadas.
- **iziToast** para resultados vacíos, errores y fin de colección — sin
  `alert()` nativos en ningún lado.
- **SimpleLightbox** para previsualización a tamaño completo con
  `lightbox.refresh()` tras cada render.

### 🔹 Build Tooling y flujo de trabajo

- **Vite** como dev server y bundler con HMR.
- Auto-despliegue en **GitHub Pages** vía GitHub Actions (`.github/workflows`).
- **Prettier** + **EditorConfig** para formato consistente.
- **Git** con commits descriptivos y atómicos.

---

## 🧩 Recorrido por las funcionalidades

### Integración con REST API

Una única función `getImagesByQuery(query, page)` encapsula **toda** la
comunicación con Pixabay. El resto de la app llama a esta función y confía en su
valor de retorno — el controlador no sabe ni necesita saber que Axios existe.
Este es el cimiento de un código API testeable, reemplazable y mantenible.

```js
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;

export async function getImagesByQuery(query, page) {
  const { data } = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 15,
      page,
    },
  });
  return data;
}
```

---

### Flujo de control con async/await

El handler de submit cuenta toda la historia del ciclo de vida de una petición:
limpiar estado previo, mostrar loader, hacer fetch, renderizar, gestionar el
botón "Load more" — y limpiar el loader pase lo que pase. El bloque
`try/catch/finally` garantiza que la UI nunca se quede atascada en estado de
carga, incluso si la red falla.

```js
form.addEventListener('submit', async e => {
  e.preventDefault();
  query = e.target.elements.searchQuery.value.trim();
  page = 1;

  if (!query) return;

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const { hits, totalHits } = await getImagesByQuery(query, page);

    if (!hits.length) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }

    createGallery(hits);
    if (page * 15 < totalHits) showLoadMoreButton();
  } catch (error) {
    iziToast.error({ message: `Request failed: ${error.message}` });
  } finally {
    hideLoader();
  }
});
```

---

### Paginación con "Load More"

La lógica de paginación es deliberadamente simple pero cubre cada caso límite:
el contador de página se resetea en cada nueva búsqueda; las páginas nuevas se
**agregan**, no reemplazan la galería; cuando se alcanza la última página, el
botón se oculta y el usuario ve un mensaje de fin de resultados. Tras cada
carga, `window.scrollBy` empuja la página suavemente para que el usuario vea de
inmediato el contenido nuevo.

```js
loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();
  try {
    const { hits, totalHits } = await getImagesByQuery(query, page);
    createGallery(hits);

    // Scroll suave de exactamente dos alturas de tarjeta
    const { height } = document
      .querySelector('.gallery-item')
      .getBoundingClientRect();
    window.scrollBy({ top: height * 2, behavior: 'smooth' });

    if (page * 15 >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } finally {
    hideLoader();
  }
});
```

---

## 🚀 Ejecución local

```bash
git clone https://github.com/mrkorzun/pixabay-image-search.git
cd pixabay-image-search
npm install
npm run dev
```

> **Nota:** este proyecto requiere una clave API de Pixabay. Consíguela gratis
> en [pixabay.com/api/docs](https://pixabay.com/api/docs/) y añádela a un
> archivo `.env` como `VITE_PIXABAY_API_KEY=tu_clave_aqui`.

El dev server imprimirá una URL local (normalmente `http://localhost:5173`).

### Build de producción

```bash
npm run build       # genera ./dist
npm run preview     # sirve el build de producción localmente
npm run deploy      # publica en GitHub Pages
```

---

## 📁 Estructura del proyecto

```
pixabay-image-search/
├── .github/workflows/       # CI/CD para despliegue en GitHub Pages
├── src/
│   ├── js/
│   │   ├── pixabay-api.js       # Capa API — peticiones Axios
│   │   └── render-functions.js  # Capa de vista — renderizado DOM y lightbox
│   ├── css/
│   │   └── styles.css
│   └── main.js                  # Controlador — lógica de negocio
├── index.html
├── .editorconfig
├── .prettierrc.json
├── package.json
├── vite.config.js
└── README.md
```

---

## 👤 Autor

**Romario Korzun** — Front-End Developer

- GitHub: [@mrkorzun](https://github.com/mrkorzun)
- Página personal: [mrkorzun.github.io](https://mrkorzun.github.io)

---

<sub>Originalmente creado como ejercicio práctico dentro del curso **GoIT
JavaScript**, como extensión de un proyecto previo de búsqueda de imágenes para
consolidar la experiencia con APIs REST, async/await y patrones de
paginación.</sub>
