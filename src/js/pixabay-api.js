import axios from 'axios';

const API = '37920997-d61a416fe3d97f4298df60b52';
const URL = 'https://pixabay.com/api/';

export function getImagesByQuery(query) {
  const params = {
    key: API,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  };

  return axios
    .get(URL, { params })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}
