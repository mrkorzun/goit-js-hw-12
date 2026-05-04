# Інтеграція з REST API: Async/Await, Axios та Пагінація

**🌐 Мова:** [English](./README.md) · **Українська** · [Русский](./README.ru.md)
· [Español](./README.es.md) · [العربية](./README.ar.md)

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Pixabay API](https://img.shields.io/badge/Pixabay-API-2EC66D?style=flat-square&logo=pixabay&logoColor=white)
![Async/Await](https://img.shields.io/badge/async%2Fawait-modern-success?style=flat-square)
![Prettier](https://img.shields.io/badge/Prettier-formatted-F7B93E?style=flat-square&logo=prettier&logoColor=black)

> Практична демонстрація **сучасної взаємодії клієнта з сервером**: споживання
> публічного REST API через Axios, керування асинхронними потоками за допомогою
> `async/await`, реалізація пагінації та структурування коду з чітким розподілом
> відповідальності між шарами даних, представлення та контролера.

🔗 **Жива демо-версія:**
[mrkorzun.github.io/pixabay-image-search](https://mrkorzun.github.io/pixabay-image-search/)

![Preview](./preview.jpg)

---

## 🎯 Що демонструє цей проєкт

Застосунок пошуку зображень, побудований поверх **Pixabay REST API**. Користувач
вводить ключове слово, застосунок отримує фото з реального стороннього сервісу,
пагінує результати через кнопку "Load more" і дозволяє переглядати повнорозмірні
зображення в lightbox. Окрім видимих фіч, проєкт побудовано на
**production-style патернах** — модульна структура файлів, виділений API-шар,
view-шар і контролер, що з'єднує їх.

| Шар                                  | Відповідальність                          |
| ------------------------------------ | ----------------------------------------- |
| **API-шар** (`pixabay-api.js`)       | Уся HTTP-комунікація з Pixabay            |
| **View-шар** (`render-functions.js`) | Рендеринг DOM, стан галереї, lightbox     |
| **Контролер** (`main.js`)            | Бізнес-логіка, обробка подій, оркестрація |

Це той самий розподіл, який ти побачиш у будь-якому фреймворковому застосунку —
реалізований тут на чистому JS, щоб довести міцність основ.

---

## 💡 Навички та компетенції

### 🔹 Споживання REST API

- Робота зі справжнім публічним API (**Pixabay**) — читання документації,
  побудова query-рядка, обробка відповідей.
- Обов'язкові query-параметри: `key`, `q`, `image_type`, `orientation`,
  `safesearch`, `per_page`, `page`.
- Парсинг структурованих JSON-відповідей з виділенням лише потрібних UI полів.
- Захисна обробка `totalHits` для визначення кінця колекції.

### 🔹 HTTP-клієнт — Axios

- **Axios** як HTTP-шар замість сирого `fetch` — автоматичний JSON-парсинг,
  чистіша семантика помилок.
- Конфігурація запиту через об'єкт `params` (без ручного збирання query-рядка).
- Централізований доступ до API через одну експортовану функцію — решта
  застосунку не торкається Axios напряму.

### 🔹 Асинхронний JavaScript — async/await

- Рефакторинг попередньої реалізації `.then()/.catch()` на сучасний синтаксис
  **async/await**.
- Блоки `try/catch/finally` для чистої обробки помилок і гарантованого
  приховання лоадера.
- Розуміння компромісу: `async/await` читається зверху вниз, але обробку відмов
  однаково треба робити явно.

### 🔹 Патерн пагінації

- Лічильник сторінки (`page`) у стейті на рівні модуля.
- Скидання до `1` при кожному новому запиті — ніколи не пагінуємо застарілі
  результати.
- Кнопка "Load more" інкрементує сторінку і **додає** нові картки, а не замінює
  їх.
- Визначення кінця колекції через `totalHits` із повідомленням для користувача.

### 🔹 Модульна архітектура

- **Розподіл відповідальності**: API (дані), render (відображення), main
  (контролер).
- ES-модулі з явними `import`/`export` — без глобальних змінних, без неявних
  залежностей.
- Кожен модуль має одну відповідальність і чіткий публічний інтерфейс.

### 🔹 UX-якість

- **Лоадер** під час запитів — UI ніколи не виглядає замороженим.
- **Плавне прокручування** через `window.scrollBy` після кожного "Load more" —
  автопозиціонування на новозавантажені картки.
- **iziToast** для порожніх результатів, помилок і кінця колекції — жодного
  нативного `alert()`.
- **SimpleLightbox** для повнорозмірного перегляду з `lightbox.refresh()` після
  кожного рендеру.

### 🔹 Build-тулінг та робочий процес

- **Vite** як dev-сервер і збірник з HMR.
- Авто-деплой на **GitHub Pages** через GitHub Actions (`.github/workflows`).
- **Prettier** + **EditorConfig** для уніфікованого форматування.
- **Git** з описовими, атомарними комітами.

---

## 🧩 Розбір функціональності

### Інтеграція з REST API

Єдина функція `getImagesByQuery(query, page)` інкапсулює **усю** комунікацію з
Pixabay. Решта застосунку викликає лише цю функцію і довіряє її поверненому
значенню — контролер не знає й не повинен знати, що існує Axios. Це фундамент
тестованого, замінюваного й підтримуваного API-коду.

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

### Керування потоком через async/await

Обробник submit розповідає всю історію життєвого циклу одного запиту: очистити
попередній стан, показати лоадер, виконати запит, відрендерити, керувати кнопкою
"Load more" — і прибрати лоадер незалежно від того, що сталось. Блок
`try/catch/finally` гарантує, що UI ніколи не застрягне у стані завантаження,
навіть якщо мережа впала.

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

### Пагінація через "Load More"

Логіка пагінації навмисне проста, але покриває кожен граничний випадок:
лічильник сторінки скидається на кожен новий пошук; нові сторінки **додаються**,
а не замінюють галерею; коли досягнуто останньої сторінки, кнопка ховається й
користувач бачить повідомлення про кінець результатів. Після кожного
завантаження `window.scrollBy` плавно зсуває сторінку, щоб користувач одразу
бачив новий контент.

```js
loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();
  try {
    const { hits, totalHits } = await getImagesByQuery(query, page);
    createGallery(hits);

    // Плавне прокручування рівно на дві висоти картки
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

## 🚀 Локальний запуск

```bash
git clone https://github.com/mrkorzun/pixabay-image-search.git
cd pixabay-image-search
npm install
npm run dev
```

> **Зверни увагу:** проєкт потребує API-ключ Pixabay. Отримай його безкоштовно
> на [pixabay.com/api/docs](https://pixabay.com/api/docs/) і додай у файл `.env`
> як `VITE_PIXABAY_API_KEY=your_key_here`.

Dev-сервер виведе локальну адресу (зазвичай `http://localhost:5173`).

### Production-збірка

```bash
npm run build       # збирає у ./dist
npm run preview     # піднімає production-збірку локально
npm run deploy      # публікує на GitHub Pages
```

---

## 📁 Структура проєкту

```
pixabay-image-search/
├── .github/workflows/       # CI/CD для деплою на GitHub Pages
├── src/
│   ├── js/
│   │   ├── pixabay-api.js       # API-шар — Axios-запити
│   │   └── render-functions.js  # View-шар — рендеринг DOM і lightbox
│   ├── css/
│   │   └── styles.css
│   └── main.js                  # Контролер — бізнес-логіка
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
- Жива сторінка: [mrkorzun.github.io](https://mrkorzun.github.io)

---

<sub>Початково створено як практична вправа в межах курсу **GoIT JavaScript**,
як розширення попереднього проєкту пошуку зображень для закріплення досвіду
роботи з REST API, async/await і патернами пагінації.</sub>
