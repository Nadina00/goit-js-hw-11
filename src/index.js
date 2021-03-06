import './css/styles.css';
import NewsImadges from './fetchCountries';
//import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const form = document.querySelector(".search-form");
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery')
const btnMore = document.querySelector('.load-more')
const newsImadges = new NewsImadges();
console.log(newsImadges);

form.addEventListener("submit", onSubmit);
btnMore.addEventListener("click", onSubmitMore);
btnMore.classList.add("is-hidden")

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

async function onSubmit(evt){
  evt.preventDefault()
  clearHits();
  newsImadges.name = input.value.trim();
    if(newsImadges.name === ""){
    alertNotFound()
    return
  }
  newsImadges.resetPage();
  btnMore.classList.remove("is-hidden")
  newsImadges.fetchImage()
  .then(data => {
    return data.hits
  })
  .then(hits => {gallery.innerHTML = createMarkup(hits)
    lightbox.refresh();})
  newsImadges.resetPage(); 
  try {
    newsImadges.fetchImage().then(data => {return data.totalHits})
    .then(totalHits =>{
   
    if (totalHits === 0) {
      clearHits();
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      btnMore.classList.add('is-hidden');}
      else if(totalHits < 40){
        btnMore.classList.add("is-hidden");
        Notify.success(`Hooray! We found ${totalHits} images.`);
      }
      else{
        Notify.success(`Hooray! We found ${totalHits} images.`);
      }
    })
  }
  catch (error) {
    console.log(error);
  }
  }



  function onSubmitMore(evt){
    
  newsImadges.fetchImage()
  .then(data => {return data.hits })
  .then(hits => {gallery.insertAdjacentHTML("beforeend", createMarkup(hits));
  lightbox.refresh();
    })
  
     try {
      newsImadges.fetchImage().then(data => {return data.totalHits})
      .then(totalHits =>{
        if ((totalHits - 40) < 40) { 
          btnMore.classList.add("is-hidden")  
          Notify.success(`We're sorry, but you've reached the end of search results.`);
         } else {Notify.success(`Hooray! We found ${totalHits} images.`);
          lightbox.refresh();}
     })
    }
    catch (error) {
      console.log(error);
    }

    }
      
 

function createMarkup(hits){
    const markup = hits.map(({name, webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => {
        return `
        
       <div class="photo-card">
       <a class="gallery__link" href="${largeImageURL}">
       <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
       </a>
       <div class="info">
         <p class="info-item">
           <b>Likes: ${likes}</b>
         </p>
         <p class="info-item">
           <b>Views: ${views}</b>
         </p>
         <p class="info-item">
           <b>Comments: ${comments}</b>
         </p>
         <p class="info-item">
           <b>Downloads: ${downloads}</b>
         </p>
       </div>
     </div>`;}).join("");
    return markup;
     
 };

 function clearHits(){
  gallery.innerHTML = "";
 }


 
  function alertNotFound(){
  Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
    
