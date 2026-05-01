import { getImagesByQuery } from './js/pixabay-api';

import iziToast from 'izitoast';
import {
  clearGallery,
  createGallery,
  hideLoader,
  showLoader,
} from './js/render-functions';

export const refs = {
  searchForm: document.querySelector('.js-form'),
};

function onSearchInput(event) {
  event.preventDefault();

  const query = event.target.elements['search-text'].value.trim();
  if (query === '') {
    iziToast.error({
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  showLoader();
  clearGallery();

  getImagesByQuery(query)
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.error({
          message: 'Sorry, there are no images matching your search query.',
          position: 'topRight',
        });
        return;
      }

      createGallery(data.hits);
    })
    .catch(error => {
      iziToast.error({ message: `Error: ${error.message}` });
    })
    .finally(() => {
      hideLoader();
      event.target.reset();
    });
}

refs.searchForm.addEventListener('submit', onSearchInput);
