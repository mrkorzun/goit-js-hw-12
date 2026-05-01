import SimpleLightbox from 'simplelightbox';
import { refs } from './refs';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function createGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <li class="gallery-item">
        <a class="gallery-link" href="${largeImageURL}">
          <img class="gallery-image" src="${webformatURL}" alt="${tags}" />
        </a>
       <ul class="info">
    <li class="info-item">
      <h2 class="info-label">Likes</h2>
      <p class="info-value">${likes}</p>
    </li>
    <li class="info-item">
      <h2 class="info-label">Views</h2>
      <p class="info-value">${views}</p>
    </li>
    <li class="info-item">
      <h2 class="info-label">Comments</h2>
      <p class="info-value">${comments}</p>
    </li>
    <li class="info-item">
      <h2 class="info-label">Downloads</h2>
      <p class="info-value">${downloads}</p>
    </li>
  </ul>
      </li>`
    )
    .join('');

  refs.galleryList.innerHTML = markup;
  lightbox.refresh();
}

export function clearGallery() {
  refs.galleryList.innerHTML = '';
}

export function showLoader() {
  refs.loader.classList.add('is-active');
}

export function hideLoader() {
  refs.loader.classList.remove('is-active');
}
