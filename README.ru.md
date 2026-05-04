# Интеграция с REST API: Async/Await, Axios и Пагинация

**🌐 Язык:** [English](./README.md) · [Українська](./README.ua.md) · **Русский**
· [Español](./README.es.md) · [العربية](./README.ar.md)

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Pixabay API](https://img.shields.io/badge/Pixabay-API-2EC66D?style=flat-square&logo=pixabay&logoColor=white)
![Async/Await](https://img.shields.io/badge/async%2Fawait-modern-success?style=flat-square)
![Prettier](https://img.shields.io/badge/Prettier-formatted-F7B93E?style=flat-square&logo=prettier&logoColor=black)

> Практическая демонстрация **современного клиент-серверного взаимодействия**:
> потребление публичного REST API через Axios, управление асинхронными потоками
> с помощью `async/await`, реализация пагинации и структурирование кода с чётким
> разделением ответственности между слоями данных, представления и контроллера.

🔗 **Живая демо-версия:**
[mrkorzun.github.io/pixabay-image-search](https://mrkorzun.github.io/pixabay-image-search/)

![Preview](./preview.jpg)

---

## 🎯 Что демонстрирует этот проект

Приложение поиска изображений, построенное поверх **Pixabay REST API**.
Пользователь вводит ключевое слово, приложение получает фото из реального
стороннего сервиса, пагинирует результаты через кнопку "Load more" и позволяет
просматривать полноразмерные изображения в lightbox. Помимо видимых фич, проект
построен на **production-style паттернах** — модульная структура файлов,
выделенный API-слой, view-слой и контроллер, который их связывает.

| Слой                                  | Ответственность                               |
| ------------------------------------- | --------------------------------------------- |
| **API-слой** (`pixabay-api.js`)       | Вся HTTP-коммуникация с Pixabay               |
| **View-слой** (`render-functions.js`) | Рендеринг DOM, состояние галереи, lightbox    |
| **Контроллер** (`main.js`)            | Бизнес-логика, обработка событий, оркестрация |

Это то же самое разделение, которое ты увидишь в любом фреймворковом приложении
— реализованное здесь на чистом JS, чтобы доказать прочность основ.

---

## 💡 Навыки и компетенции

### 🔹 Потребление REST API

- Работа с настоящим публичным API (**Pixabay**) — чтение документации,
  построение query-строки, обработка ответов.
- Обязательные query-параметры: `key`, `q`, `image_type`, `orientation`,
  `safesearch`, `per_page`, `page`.
- Парсинг структурированных JSON-ответов с выделением только нужных UI полей.
- Защитная обработка `totalHits` для определения конца коллекции.

### 🔹 HTTP-клиент — Axios

- **Axios** как HTTP-слой вместо сырого `fetch` — автоматический JSON-парсинг,
  чище семантика ошибок.
- Конфигурация запроса через объект `params` (без ручного построения
  query-строки).
- Централизованный доступ к API через одну экспортированную функцию — остальная
  часть приложения не касается Axios напрямую.

### 🔹 Асинхронный JavaScript — async/await

- Рефакторинг предыдущей реализации `.then()/.catch()` на современный синтаксис
  **async/await**.
- Блоки `try/catch/finally` для чистой обработки ошибок и гарантированного
  скрытия лоадера.
- Понимание компромисса: `async/await` читается сверху вниз, но обработку
  отказов всё равно нужно делать явно.

### 🔹 Паттерн пагинации

- Счётчик страницы (`page`) в стейте на уровне модуля.
- Сброс к `1` при каждом новом запросе — никогда не пагинируем устаревшие
  результаты.
- Кнопка "Load more" инкрементирует страницу и **добавляет** новые карточки, а
  не заменяет их.
- Определение конца коллекции через `totalHits` с сообщением для пользователя.

### 🔹 Модульная архитектура

- **Разделение ответственности**: API (данные), render (отображение), main
  (контроллер).
- ES-модули с явными `import`/`export` — без глобальных переменных, без неявных
  зависимостей.
- Каждый модуль имеет одну ответственность и чёткий публичный интерфейс.

### 🔹 UX-качество

- **Лоадер** во время запросов — UI никогда не выглядит замороженным.
- **Плавное прокручивание** через `window.scrollBy` после каждого "Load more" —
  автопозиционирование на новозагруженные карточки.
- **iziToast** для пустых результатов, ошибок и конца коллекции — никаких
  нативных `alert()`.
- **SimpleLightbox** для полноразмерного просмотра с `lightbox.refresh()` после
  каждого рендера.

### 🔹 Build-тулинг и рабочий процесс

- **Vite** как dev-сервер и сборщик с HMR.
- Авто-деплой на **GitHub Pages** через GitHub Actions (`.github/workflows`).
- **Prettier** + **EditorConfig** для единого форматирования.
- **Git** с описательными, атомарными коммитами.

---

## 🧩 Разбор функциональности

### Интеграция с REST API

Единственная функция `getImagesByQuery(query, page)` инкапсулирует **всю**
коммуникацию с Pixabay. Остальная часть приложения вызывает только эту функцию и
доверяет её возвращаемому значению — контроллер не знает и не должен знать, что
существует Axios. Это фундамент тестируемого, заменяемого и поддерживаемого
API-кода.

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

### Управление потоком через async/await

Обработчик submit рассказывает всю историю жизненного цикла одного запроса:
очистить предыдущее состояние, показать лоадер, выполнить запрос, отрендерить,
управлять кнопкой "Load more" — и убрать лоадер независимо от того, что
произошло. Блок `try/catch/finally` гарантирует, что UI никогда не застрянет в
состоянии загрузки, даже если сеть упала.

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

### Пагинация через "Load More"

Логика пагинации намеренно проста, но покрывает каждый граничный случай: счётчик
страницы сбрасывается при каждом новом поиске; новые страницы **добавляются**, а
не заменяют галерею; когда достигнута последняя страница, кнопка прячется и
пользователь видит сообщение об окончании результатов. После каждой загрузки
`window.scrollBy` плавно сдвигает страницу, чтобы пользователь сразу видел новый
контент.

```js
loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();
  try {
    const { hits, totalHits } = await getImagesByQuery(query, page);
    createGallery(hits);

    // Плавное прокручивание ровно на две высоты карточки
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

## 🚀 Локальный запуск

```bash
git clone https://github.com/mrkorzun/pixabay-image-search.git
cd pixabay-image-search
npm install
npm run dev
```

> **Обрати внимание:** проекту нужен API-ключ Pixabay. Получи его бесплатно на
> [pixabay.com/api/docs](https://pixabay.com/api/docs/) и добавь в файл `.env`
> как `VITE_PIXABAY_API_KEY=your_key_here`.

Dev-сервер выведет локальный адрес (обычно `http://localhost:5173`).

### Production-сборка

```bash
npm run build       # собирает в ./dist
npm run preview     # поднимает production-сборку локально
npm run deploy      # публикует на GitHub Pages
```

---

## 📁 Структура проекта

```
pixabay-image-search/
├── .github/workflows/       # CI/CD для деплоя на GitHub Pages
├── src/
│   ├── js/
│   │   ├── pixabay-api.js       # API-слой — Axios-запросы
│   │   └── render-functions.js  # View-слой — рендеринг DOM и lightbox
│   ├── css/
│   │   └── styles.css
│   └── main.js                  # Контроллер — бизнес-логика
├── index.html
├── .editorconfig
├── .prettierrc.json
├── package.json
├── vite.config.js
└── README.md
```

---

## 👤 Автор

**Romario Korzun** — Front-End Developer

- GitHub: [@mrkorzun](https://github.com/mrkorzun)
- Живая страница: [mrkorzun.github.io](https://mrkorzun.github.io)

---

<sub>Изначально создано как практическое упражнение в рамках курса **GoIT
JavaScript**, как расширение предыдущего проекта поиска изображений для
закрепления опыта работы с REST API, async/await и паттернами пагинации.</sub>
