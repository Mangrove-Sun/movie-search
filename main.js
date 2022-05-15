async function getMovie(name, page = 1) {
  let res = await fetch(`https://www.omdbapi.com?apikey=7035c60c&s=${name}&page=${page}`);
  res = await res.json();

  console.log(page);
  return res;
}

function renderMovie(movies, isFirst) {
  //
}
function searchInfoOn() {
  const infoEl = document.querySelector('.search .search-info-area');
  infoEl.classList.add('on');
}
function moreBtnOn() {
  const moreBtnEl = document.querySelector('.more-btn-area .more-btn');
  moreBtnEl.classList.add('on');
}
function searchInfo(searchEl, totalResults) {
  searchTitleEl.innerHTML = searchEl.value;
  totalResultsEl.innerHTML = parseInt(totalResults);
}

const loadingEl = document.querySelector('.more-btn-area .inner .loader');



let totalResultsEl = document.querySelector('.search .search-info-area .search-total');
let searchTitleEl = document.querySelector('.search .search-info-area .search-title');

let page = 1;
let totalResults = 0;
const searchEl = document.querySelector('.search .search-area input');
const searchBtnEl = document.querySelector('.search .search-area button.search-btn');
const ulEl = document.createElement('ul');
const resultAreaEl = document.querySelector('section.result .inner');

searchBtnEl.addEventListener('click', async () => {
  loadingEl.classList.add('on');
  resultAreaEl.innerHTML = '';
  page = 1;
  const movies = await getMovie(searchEl.value, page);
  page = 2;
  
  const { Search, totalResults } = movies;
  
  searchInfo(searchEl, totalResults);
  searchInfoOn();
  // Nu..parseI.t()
  
  // renderMovie(movies, true)
  // if (isFirst) { ...
  ulEl.innerHTML = '';
  Search.forEach(movie => {
    const liEl = document.createElement('li');
    liEl.innerHTML = /* html */`
      <a href="javascript:void(0)">
        <img src="${movie.Poster}" alt="${movie.Title}"/>
      </a>
      `;
    ulEl.append(liEl);
    resultAreaEl.append(ulEl);
  });
  loadingEl.classList.remove('on');
  moreBtnOn();
    
})

const moreBtnEl = document.querySelector('button.more-btn');


moreBtnEl.addEventListener('click', async () => {
  if (page === 1) return // ??
  const movies = await getMovie(searchEl.value, page);
  page += 1;

  const { Search, totalResults } = movies;
  Search.forEach(movie => {
    const liEl = document.createElement('li');
    liEl.innerHTML = `<img src="${movie.Poster}" alt="${movie.Title}"/>`;
    ulEl.append(liEl);
    resultAreaEl.append(ulEl);
  })
  // renderMovie(movies)
})

