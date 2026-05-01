import axios from 'axios';

const API = '37920997-d61a416fe3d97f4298df60b52';
const URL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page) {
  const params = {
    key: API,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 15, // сколько мы хотим выводить элементов за один запрос
    page, // short properties 'yo'
  };

  const { data } = await axios.get(URL, { params });
  // console.log(data);
  return data;
  // убрали then and catch на async/await которая возвращает promis
}
