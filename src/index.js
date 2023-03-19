import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PhotoApiService from './js/PhotoApiService';
import AOS from 'aos';
import 'aos/dist/aos.css';

const refs = {
  formEl: document.querySelector('.search-form'),
  galleryEl: document.querySelector('.gallery'),
  btnSearch: document.querySelector('[type="submit"]'),
  //   btnLoadMore: document.querySelector('[data-action="load-more"]'),
  //   containerForLoadBtn: document.querySelector('.btn-load-container'),
  //   btnDown: document.querySelector('.btn-down'),
  //   btnUp: document.querySelector('.btn-up'),
  sentinel: document.querySelector('#sentinel'),
};

AOS.init();

const onEntry = entries => {
  entries.forEach(entrie => {
    if (entrie.isIntersecting && photoApiService.query !== '') {
      arrfetchImages();
      onLoadMore();
    }
  });
};
const options = {
  rootMargin: '150px',
};

const observer = new IntersectionObserver(onEntry, options);
const slider = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
  scrollZoom: false,
});

const photoApiService = new PhotoApiService();

let valueForSearch = '';
let isPreviousWord;

refs.formEl.addEventListener('submit', onSubmit);
// refs.btnLoadMore.addEventListener('click', onLoadMore);
// refs.btnDown.addEventListener('click', scrollDownBtn);
// refs.btnUp.addEventListener('click', scrollUpBtn);

async function onSubmit(event) {
  event.preventDefault();
  observer.unobserve(refs.sentinel);
  valueForSearch = refs.formEl.elements.searchQuery.value.trim();

  if (valueForSearch === '') {
    onErrorNotify();
    return;
  }

  //   addClassHidden();
  refs.galleryEl.innerHTML = '';
  photoApiService.resetPage();

  const previousWord = event.currentTarget.elements.searchQuery.value.trim();

  if (isPreviousWord === previousWord) {
    Notiflix.Notify.info('Enter new word to search');
    return;
  }

  await insertMarkup();
  if (photoApiService.arrRespLength === 0) {
    Notiflix.Notify.failure('Try to Enter another word');
    return;
  }
  if (photoApiService.respDataTotal !== 0) {
    Notiflix.Notify.success(
      `Hooray! We found ${photoApiService.respDataTotal} images for you.`
    );
  }
  if (photoApiService.totalPages === 1) {
    return;
  }

  observer.observe(refs.sentinel);
  //   removeClassHidden();
  //   refs.btnLoadMore.classList.add('btn');

  return (isPreviousWord = previousWord);
}

async function onLoadMore() {
  photoApiService.incrementPage();
  await insertMarkup();

  if (photoApiService.page === photoApiService.totalPages) {
    refs.btnLoadMore.classList.add('hidden');
    Notiflix.Notify.info('Your search result comes to an end:((');
    observer.unobserve(refs.sentinel);
    return;
  }
}

async function insertMarkup() {
  valueForSearch = refs.formEl.elements.searchQuery.value.trim();
  photoApiService.searchQuery = valueForSearch;

  //   refs.btnLoadMore.classList.remove('hidden');
  refs.galleryEl.insertAdjacentHTML(
    'beforeend',
    renderMarkup(await photoApiService.fetchPics())
  );
  slider.refresh();
}

function onErrorNotify() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function renderMarkup(arr) {
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div data-aos="fade-up"
     data-aos-duration="1000">
<a class="gallery__item pagination__next" href='${largeImageURL}'><div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy"  class="img"/>
        <div class="info">
          <p class="info-item">
            <b>Likes:<br>${likes}</br></b>
          </p>
          <p class="info-item">
            <b>Views:<br>${views}</br></b>
          </p>
          <p class="info-item">
            <b>Comments:<br>${comments}</br></b>
          </p>
          <p class="info-item">
            <b>Downloads:<br>${downloads}</br></b>
          </p>
        </div>
      </div></a></div>`
    )
    .join('');
  return markup;
}

// function scrollDownBtn() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
// }

// function scrollUpBtn() {
//   window.scrollTo({
//     top: 0,
//     behavior: 'smooth',
//   });
// }

// function removeClassHidden() {
//   refs.btnUp.classList.remove('hidden');
//   refs.btnDown.classList.remove('hidden');
//   refs.containerForLoadBtn.classList.remove('hidden');
//   refs.btnLoadMore.classList.remove('hidden');
// }

// function addClassHidden() {
//   refs.btnUp.classList.remove('hidden');
//   refs.btnDown.classList.add('hidden');
//   refs.containerForLoadBtn.classList.add('hidden');
//   refs.btnLoadMore.classList.add('hidden');
// }

function arrfetchImages() {
  setTimeout(() => {
    const totalPages = Math.ceil(
      photoApiService.totalHits / photoApiService.perPage
    );

    if (photoApiService.page > totalPages) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      observer.unobserve(refs.sentinel);
      return;
    }
  }, 500);
}
