import axios from 'axios';
 const BASE_URL = 'https://pixabay.com/api/'
 let page = 1;

 export default class NewsImadges{ 
constuctor(){
  this.name = ""
   
}


incrementPage() {
  page += 1;
}
resetPage() {
  page = 1;
}
  get query(){
    return this.name
  }
  set query(newQuary){
    this.name = newQuary
  }

async  fetchImage() {
  try {
    const keyapi = '28114621-1bda22df542ac7e20c7c31167';
    const requestparams = `?image_type=photo&orientation=horizontal&q=${this.name}&page=${page}&per_page=40&key=${keyapi}`
    const url = BASE_URL + requestparams;
    
    return await axios.get(`${url}`).then(response => response.data);}
catch (err) {
  console.log(err);
  throw err;
}
 }
}
