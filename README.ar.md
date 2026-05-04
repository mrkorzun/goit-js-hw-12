<div dir="rtl">

# الدمج مع REST API: Async/Await و Axios والترقيم

**🌐 اللغة:** [English](./README.md) · [Українська](./README.ua.md) ·
[Русский](./README.ru.md) · [Español](./README.es.md) · **العربية**

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Pixabay API](https://img.shields.io/badge/Pixabay-API-2EC66D?style=flat-square&logo=pixabay&logoColor=white)
![Async/Await](https://img.shields.io/badge/async%2Fawait-modern-success?style=flat-square)
![Prettier](https://img.shields.io/badge/Prettier-formatted-F7B93E?style=flat-square&logo=prettier&logoColor=black)

> عرض عملي **للتفاعل الحديث بين العميل والخادم**: استهلاك واجهة REST API عامة
> عبر Axios، وإدارة التدفقات غير المتزامنة باستخدام `async/await`، وتنفيذ
> الترقيم، وهيكلة الكود مع فصل واضح للمسؤوليات بين طبقات البيانات والعرض
> والتحكم.

🔗 **العرض المباشر:**
[mrkorzun.github.io/pixabay-image-search](https://mrkorzun.github.io/pixabay-image-search/)

![Preview](./preview.jpg)

---

## 🎯 ما الذي يُظهره هذا المشروع

تطبيق للبحث عن الصور مبني فوق **واجهة Pixabay REST API**. يُدخل المستخدم كلمة
مفتاحية، فيجلب التطبيق الصور من خدمة طرف ثالث حقيقية، ويُرقّم النتائج عبر زرّ
"Load more"، ويتيح معاينة الصور بحجمها الكامل في lightbox. وإلى جانب الميزات
الظاهرة، يقوم المشروع على **أنماط بأسلوب الإنتاج** — بنية ملفات معيارية، طبقة
API مخصّصة، طبقة عرض، ومتحكّم يربط بينهم.

| الطبقة                                 | المسؤولية                                |
| -------------------------------------- | ---------------------------------------- |
| **طبقة API** (`pixabay-api.js`)        | كلّ الاتصالات HTTP مع Pixabay            |
| **طبقة العرض** (`render-functions.js`) | عرض DOM، حالة المعرض، lightbox           |
| **المتحكّم** (`main.js`)               | منطق العمل، إدارة الأحداث، التنسيق العام |

هذا الفصل ذاته الذي ستراه في أيّ تطبيق مبني على أُطر — منفّذ هنا بـ JavaScript
نقي لإثبات متانة الأساسيات.

---

## 💡 المهارات والكفاءات

### 🔹 استهلاك REST API

- التعامل مع API عامة حقيقية (**Pixabay**) — قراءة الوثائق، بناء سلاسل
  الاستعلام، معالجة الردود.
- معاملات الاستعلام المطلوبة: `key`، `q`، `image_type`، `orientation`،
  `safesearch`، `per_page`، `page`.
- تحليل ردود JSON المهيكلة واستخراج الحقول التي تحتاجها الواجهة فقط.
- معالجة دفاعية لـ `totalHits` لاكتشاف نهاية المجموعة.

### 🔹 عميل HTTP — Axios

- **Axios** كطبقة HTTP بدلاً من `fetch` الخام — تحليل JSON تلقائي ودلالات أوضح
  للأخطاء.
- ضبط الطلب عبر كائن `params` (دون بناء سلسلة الاستعلام يدوياً).
- وصول مركزي إلى الـ API عبر دالة مُصدَّرة واحدة — بقية التطبيق لا يلمس Axios
  مباشرةً أبداً.

### 🔹 JavaScript غير المتزامن — async/await

- إعادة هيكلة تنفيذ سابق بـ `.then()/.catch()` إلى صياغة **async/await**
  الحديثة.
- كتل `try/catch/finally` لمعالجة نظيفة للأخطاء وضمان إخفاء اللودر.
- إدراك المقايضة: `async/await` يُقرأ من الأعلى إلى الأسفل، لكن لا يزال يلزم
  التعامل مع الرفض صراحةً.

### 🔹 نمط الترقيم

- عدّاد الصفحة (`page`) محفوظ في حالة على مستوى الوحدة.
- إعادة التعيين إلى `1` عند كلّ بحث جديد — لا نُرقّم نتائج قديمة أبداً.
- زرّ "Load more" يزيد الصفحة و**يُلحق** البطاقات الجديدة بدل استبدالها.
- اكتشاف نهاية المجموعة عبر `totalHits` مع رسالة موجَّهة للمستخدم.

### 🔹 البنية المعيارية

- **فصل المسؤوليات**: API (بيانات)، render (عرض)، main (متحكّم).
- وحدات ES بـ `import`/`export` صريحَين — دون متغيّرات عامّة ودون اعتماديات
  ضمنية.
- لكلّ وحدة مسؤولية واحدة وواجهة عامة واضحة.

### 🔹 جودة تجربة المستخدم

- **لودر** أثناء الطلبات — لا تبدو الواجهة متجمّدة أبداً.
- **تمرير سلس** عبر `window.scrollBy` بعد كلّ "Load more" — يضع المستخدم
  تلقائياً عند البطاقات المُحمَّلة حديثاً.
- **iziToast** للنتائج الفارغة والأخطاء ونهاية المجموعة — لا `alert()` أصلية في
  أيّ مكان.
- **SimpleLightbox** لمعاينة الصور بحجمها الكامل مع `lightbox.refresh()` بعد كلّ
  عرض.

### 🔹 أدوات البناء وسير العمل

- **Vite** كخادم تطوير ومُحزّم مع HMR.
- نشر تلقائي إلى **GitHub Pages** عبر GitHub Actions (`.github/workflows`).
- **Prettier** + **EditorConfig** لتنسيق متّسق.
- **Git** بكوميتات وصفية وذرّية.

---

## 🧩 استعراض الوظائف

### الدمج مع REST API

دالة وحيدة `getImagesByQuery(query, page)` تُغلّف **كلّ** الاتصالات مع Pixabay.
بقية التطبيق تستدعي هذه الدالة وحدها وتثق بقيمتها المُعادة — المتحكّم لا يعرف
ولا يحتاج أن يعرف بوجود Axios. هذا أساس الكود القابل للاختبار والاستبدال
والصيانة في طبقة الـ API.

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

### التحكم بالتدفّق عبر async/await

معالج submit يحكي القصة الكاملة لدورة حياة طلب واحد: تنظيف الحالة السابقة، إظهار
اللودر، تنفيذ الطلب، العرض، إدارة زرّ "Load more" — وإخفاء اللودر مهما حدث. كتلة
`try/catch/finally` تضمن أنّ الواجهة لن تَعلَق في حالة تحميل أبداً، حتى لو فشلت
الشبكة.

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

### الترقيم عبر "Load More"

منطق الترقيم بسيط عمداً، لكنّه يغطّي كلّ حالة حدّية: يُعاد عدّاد الصفحة في كلّ
بحث جديد؛ تُلحَق الصفحات الجديدة ولا تستبدل المعرض؛ وعند بلوغ الصفحة الأخيرة
يختفي الزرّ ويرى المستخدم رسالة بانتهاء النتائج. بعد كلّ تحميل، يدفع
`window.scrollBy` الصفحة بسلاسة ليرى المستخدم المحتوى الجديد فوراً.

```js
loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();
  try {
    const { hits, totalHits } = await getImagesByQuery(query, page);
    createGallery(hits);

    // تمرير سلس بمقدار ارتفاعَي بطاقة بالضبط
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

## 🚀 التشغيل محلياً

```bash
git clone https://github.com/mrkorzun/pixabay-image-search.git
cd pixabay-image-search
npm install
npm run dev
```

> **ملاحظة:** يحتاج المشروع إلى مفتاح API لخدمة Pixabay. احصل عليه مجاناً من
> [pixabay.com/api/docs](https://pixabay.com/api/docs/) وأضِفه إلى ملفّ `.env`
> بالشكل `VITE_PIXABAY_API_KEY=your_key_here`.

سيطبع خادم التطوير عنواناً محلياً (عادةً `http://localhost:5173`).

### بناء الإنتاج

```bash
npm run build       # يبني إلى ./dist
npm run preview     # يُشغّل بناء الإنتاج محلياً
npm run deploy      # ينشر على GitHub Pages
```

---

## 📁 بنية المشروع

```
pixabay-image-search/
├── .github/workflows/       # CI/CD للنشر على GitHub Pages
├── src/
│   ├── js/
│   │   ├── pixabay-api.js       # طبقة API — طلبات Axios
│   │   └── render-functions.js  # طبقة العرض — عرض DOM و lightbox
│   ├── css/
│   │   └── styles.css
│   └── main.js                  # المتحكّم — منطق العمل
├── index.html
├── .editorconfig
├── .prettierrc.json
├── package.json
├── vite.config.js
└── README.md
```

---

## 👤 المؤلف

**Romario Korzun** — مطوّر واجهات أمامية

- GitHub: [@mrkorzun](https://github.com/mrkorzun)
- الصفحة الشخصية: [mrkorzun.github.io](https://mrkorzun.github.io)

---

<sub>أُنشئ في الأصل كتمرين عملي ضمن منهج **GoIT JavaScript** كتوسيع لمشروع سابق
للبحث عن الصور، لترسيخ الخبرة بواجهات REST API و async/await وأنماط
الترقيم.</sub>

</div>
