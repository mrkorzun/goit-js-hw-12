import{a as f,S as m,i as n}from"./assets/vendor-BUyyBWjX.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function r(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function a(e){if(e.ep)return;e.ep=!0;const t=r(e);fetch(e.href,t)}})();const h="37920997-d61a416fe3d97f4298df60b52",p="https://pixabay.com/api/";function d(o){const s={key:h,q:o,image_type:"photo",orientation:"horizontal",safesearch:"true"};return f.get(p,{params:s}).then(r=>r.data).catch(r=>{throw console.error(r),r})}const l={galleryList:document.querySelector(".js-gallery"),loader:document.querySelector(".loader")},g=new m(".gallery a",{captionsData:"alt",captionDelay:250});function y(o){const s=o.map(({webformatURL:r,largeImageURL:a,tags:e,likes:t,views:i,comments:c,downloads:u})=>`
      <li class="gallery-item">
        <a class="gallery-link" href="${a}">
          <img class="gallery-image" src="${r}" alt="${e}" />
        </a>
       <ul class="info">
    <li class="info-item">
      <h2 class="info-label">Likes</h2>
      <p class="info-value">${t}</p>
    </li>
    <li class="info-item">
      <h2 class="info-label">Views</h2>
      <p class="info-value">${i}</p>
    </li>
    <li class="info-item">
      <h2 class="info-label">Comments</h2>
      <p class="info-value">${c}</p>
    </li>
    <li class="info-item">
      <h2 class="info-label">Downloads</h2>
      <p class="info-value">${u}</p>
    </li>
  </ul>
      </li>`).join("");l.galleryList.innerHTML=s,g.refresh()}function L(){l.galleryList.innerHTML=""}function b(){l.loader.classList.add("is-active")}function v(){l.loader.classList.remove("is-active")}const $={searchForm:document.querySelector(".js-form")};function q(o){o.preventDefault();const s=o.target.elements["search-text"].value.trim();if(s===""){n.error({message:"Please enter a search query!",position:"topRight"});return}b(),L(),d(s).then(r=>{if(r.hits.length===0){n.error({message:"Sorry, there are no images matching your search query.",position:"topRight"});return}y(r.hits)}).catch(r=>{n.error({message:`Error: ${r.message}`})}).finally(()=>{v(),o.target.reset()})}$.searchForm.addEventListener("submit",q);
//# sourceMappingURL=index.js.map
