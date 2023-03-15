import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  formData: document.querySelector('search-form'),
};

refs.formData.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
}
