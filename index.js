import{a as b,S as v,i as l}from"./assets/vendor-DwrtbQg9.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function s(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(e){if(e.ep)return;e.ep=!0;const r=s(e);fetch(e.href,r)}})();const B="37920997-d61a416fe3d97f4298df60b52",M="https://pixabay.com/api/";async function h(o,t){const s={key:B,q:o,image_type:"photo",orientation:"horizontal",safesearch:"true",per_page:15,page:t},{data:a}=await b.get(M,{params:s});return a}const i={galleryList:document.querySelector(".js-gallery"),loader:document.querySelector(".loader"),searchForm:document.querySelector(".js-form"),loadMoreBtn:document.querySelector(".js-btn-more")},S=new v(".gallery a",{captionsData:"alt",captionDelay:250});function m(o){const t=o.map(({webformatURL:s,largeImageURL:a,tags:e,likes:r,views:c,comments:y,downloads:L})=>`
      <li class="gallery-item">
        <a class="gallery-link" href="${a}">
          <img class="gallery-image" src="${s}" alt="${e}" />
        </a>
       <ul class="info">
    <li class="info-item">
      <h2 class="info-label">Likes</h2>
      <p class="info-value">${r}</p>
    </li>
    <li class="info-item">
      <h2 class="info-label">Views</h2>
      <p class="info-value">${c}</p>
    </li>
    <li class="info-item">
      <h2 class="info-label">Comments</h2>
      <p class="info-value">${y}</p>
    </li>
    <li class="info-item">
      <h2 class="info-label">Downloads</h2>
      <p class="info-value">${L}</p>
    </li>
  </ul>
      </li>`).join("");i.galleryList.insertAdjacentHTML("beforeend",t),S.refresh()}function q(){i.galleryList.innerHTML=""}function g(){i.loader.classList.add("is-active")}function p(){i.loader.classList.remove("is-active")}function d(){i.loadMoreBtn.classList.remove("is-hidden")}function f(){i.loadMoreBtn.classList.add("is-hidden")}let n=1,u="";i.searchForm.addEventListener("submit",w);i.loadMoreBtn.addEventListener("click",$);async function w(o){if(o.preventDefault(),u=o.target.elements["search-text"].value.trim(),u===""){l.error({message:"Please enter a search query!",position:"topRight"});return}n=1,g(),q(),f();try{const{hits:t,totalHits:s}=await h(u,n);if(t.length===0){l.error({message:"Sorry, there are no images matching your search query.",position:"topRight"});return}m(t),d(),n*15>=s?(f(),l.info({message:"We're sorry, but you've reached the end of search results.",position:"topRight"})):d()}catch(t){l.error({message:`Error: ${t.message}`})}finally{p(),o.target.reset()}}async function $(o){n++,f(),g();try{const{hits:t,totalHits:s}=await h(u,n);m(t);const a=i.galleryList.children[0].getBoundingClientRect().height;scrollBy({top:a*2,behavior:"smooth"}),n*15>=s?(f(),l.info({message:"We're sorry, but you've reached the end of search results.",position:"topRight"})):d()}catch(t){l.error({message:`Error: ${t.message}`})}finally{p()}}
//# sourceMappingURL=index.js.map
