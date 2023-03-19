import Notiflix from 'notiflix';
import axios from 'axios';

const MY_KEY = '34183699-29109d6fbf2dd60241f6d6e15';
const BASE_URL = 'https://pixabay.com/api/';
const OPTIONS_FOR_RESPONSE =
  'image_type=photo&orientation=horizontal&safesearch=true';

export default class PhotoApiService {
  constructor() {
    this.arrRespLength = 0;
    this.totalHits = 1;
    this.totalPages = 1;
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
    this.respDataTotal = 0;
  }

  async fetchPics() {
    try {
      const response = await axios.get(
        `${BASE_URL}?key=${MY_KEY}&q=${this.searchQuery}&${OPTIONS_FOR_RESPONSE}&page=${this.page}&per_page=${this.perPage}`
      );
      this.arrRespLength = response.data.hits.length;
      this.totalHits = response.data.totalHits;
      this.totalPages = Math.ceil(this.totalHits / this.perPage);
      this.respDataTotal = response.data.total;

      return response.data.hits;
    } catch (e) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
