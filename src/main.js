import { getImagesByQuery } from './js/pixabay-api';

import iziToast from 'izitoast';
import {
  clearGallery,
  createGallery,
  hideLoader,
  hideLoadMoreButton,
  showLoader,
  showLoadMoreButton,
} from './js/render-functions';

import { refs } from './js/refs';

let page = 1;
let query = '';

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function onSearchFormSubmit(event) {
  event.preventDefault();

  query = event.target.elements['search-text'].value.trim();
  if (query === '') {
    iziToast.error({
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  page = 1;
  showLoader();
  clearGallery();
  hideLoadMoreButton();

  try {
    const { hits, totalHits } = await getImagesByQuery(query, page);

    if (hits.length === 0) {
      iziToast.error({
        message: 'Sorry, there are no images matching your search query.',
        position: 'topRight',
      });
      return;
    }

    createGallery(hits);
    showLoadMoreButton();

    if (page * 15 >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({ message: `Error: ${error.message}` });
  } finally {
    hideLoader();
    event.target.reset();
  }
}

async function onLoadMoreBtnClick(event) {
  page++;
  hideLoadMoreButton();
  showLoader();
  try {
    const { hits, totalHits } = await getImagesByQuery(query, page);

    createGallery(hits);

    const cardHeight =
      refs.galleryList.children[0].getBoundingClientRect().height;

    scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (page * 15 >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: `We're sorry, but you've reached the end of search results.`,
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({ message: `Error: ${error.message}` });
  } finally {
    hideLoader();
  }
}
