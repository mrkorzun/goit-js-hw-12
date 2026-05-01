import{a as f,S as m,i as n}from"./assets/vendor-DwrtbQg9.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function s(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(e){if(e.ep)return;e.ep=!0;const r=s(e);fetch(e.href,r)}})();const p="37920997-d61a416fe3d97f4298df60b52",d="https://pixabay.com/api/";async function h(i,t){const s={key:p,q:i,image_type:"photo",orientation:"horizontal",safesearch:"true",per_page:15,page:t},{data:o}=await f.get(d,{params:s});return o}const l={galleryList:document.querySelector(".js-gallery"),loader:document.querySelector(".loader"),searchForm:document.querySelector(".js-form")},g=new m(".gallery a",{captionsData:"alt",captionDelay:250});function y(i){const t=i.map(({webformatURL:s,largeImageURL:o,tags:e,likes:r,views:a,comments:c,downloads:u})=>`
      <li class="gallery-item">
        <a class="gallery-link" href="${o}">
          <img class="gallery-image" src="${s}" alt="${e}" />
        </a>
       <ul class="info">
    <li class="info-item">
      <h2 class="info-label">Likes</h2>
      <p class="info-value">${r}</p>
    </li>
    <li class="info-item">
      <h2 class="info-label">Views</h2>
      <p class="info-value">${a}</p>
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
      </li>`).join("");l.galleryList.innerHTML=t,g.refresh()}function L(){l.galleryList.innerHTML=""}function b(){l.loader.classList.add("is-active")}function v(){l.loader.classList.remove("is-active")}function q(i){i.preventDefault();const t=i.target.elements["search-text"].value.trim();if(t===""){n.error({message:"Please enter a search query!",position:"topRight"});return}b(),L(),h(t).then(s=>{if(s.hits.length===0){n.error({message:"Sorry, there are no images matching your search query.",position:"topRight"});return}y(s.hits)}).catch(s=>{n.error({message:`Error: ${s.message}`})}).finally(()=>{v(),i.target.reset()})}l.searchForm.addEventListener("submit",q);
//# sourceMappingURL=index.js.map
