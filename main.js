// 영화 가져오기
const API_KEY = '7035c60c';
async function getMovie(name, page = 1) {
  let res = await fetch(`https://www.omdbapi.com?apikey=${API_KEY}&s=${name}&page=${page}`);
  res = await res.json();
  return res;
}
// 영화 상세정보 가져오기
async function getMovieInfo(id) {
  let res = await fetch(`https://www.omdbapi.com?apikey=${API_KEY}&i=${id}`);
  res = await res.json();
  return res;
}
// 검색한 영화 제목, 연관된 영화 개수 산정해 화면 출력
function searchInfoOn(title, total) {
  searchTitleEl.innerHTML = title.value;
  totalResultsEl.innerHTML = total;
  headerSearchTitleEl.innerHTML = title.value;
  headerTotalResultsEl.innerHTML = total;
  sectionInfoEl.classList.add('on');
  headerInfoEl.classList.add('on');
}
// 총 페이지 산정 (10개 = 1페이지)
function totalPage(total) {
  totalpages = parseInt(total / 10);
  if (total % 10 !== 0) totalpages += 1;
  return totalpages;
}
// 최신 검색값 찾기
function lastSearch(section, header){
  let search = '';
  if (header <= section ) {
    headerInputEl.value = searchInputEl.value;
    search = searchInputEl.value;
  } else {
    searchInputEl.value = headerInputEl.value;
    search = headerInputEl.value;
  }
  return search;
}
// 검색한 영화 결과 없을 때
function noMovie() {
  sectionInfoEl.classList.remove('on');
  intersectionEl.classList.remove('on');
  dataLoadingEl.classList.remove('on');
  notFoundEl.classList.add('on');
}



const searchInputEl = document.querySelector('.search .search-area input');
const searchBtnEl = document.querySelector('.search .search-area .search-btn');

const searchTitleEl = document.querySelector('.result .search-info-area .search-title');
const totalResultsEl = document.querySelector('.result .search-info-area .search-total');

const ulEl = document.createElement('ul');
const searchResultAreaEl = document.querySelector('section.result .inner');

const dataLoadingEl = document.querySelector('.more-movie-area .intersection-area .loader');

const sectionInfoEl = document.querySelector('.result .search-info-area');
const headerInfoEl = document.querySelector('.header-fixed-wrap .search-info-area');

const headerInputEl = document.querySelector('.header-fixed-wrap .fixed-search-area input');
const headerBtnEl = document.querySelector('.header-fixed-wrap .fixed-search-area .search-btn');
const headerSearchTitleEl = document.querySelector('.header-fixed-wrap .search-info-area .search-title');
const headerTotalResultsEl = document.querySelector('.header-fixed-wrap .search-info-area .search-total');

const notFoundEl = document.querySelector('.result .not-found');

let page = 1;
let totalpages = 0;
let movieIds = [];
let spanEls = [];
let headerSearch = 0;
let sectionSearch = 0;

// 인라인 방식
async function requestMovie() {
  if (searchInputEl.value.trim() == '' || searchInputEl.value.trim() == ' ') return searchInputEl.value = '';
  ulEl.innerHTML = '';
  notFoundEl.classList.remove('on');
  intersectionEl.classList.add('on');
  dataLoadingEl.classList.add('on');
  page = 1;
  movieIds = [];
  // 검색할 값 지정
  const searchMovie = await lastSearch(sectionSearch, headerSearch);
  const movies = await getMovie(searchMovie, page);
  page = 2;

  const { Search, totalResults } = movies;
  if ( totalResults == undefined ) return noMovie();
  const total = parseInt(totalResults);

  
  searchInfoOn(searchInputEl, total);
  totalPage(total);
  
  
  Search.forEach(movie => {
    const liEl = document.createElement('li');
    liEl.innerHTML = /* html */`
      <img id="${movie.imdbID}" src="${movie.Poster}" alt="${movie.Title}" />
      <div class="post-cover">
        <span>View More</span>
      </div>
    `;
    ulEl.append(liEl);
    dataLoadingEl.classList.remove('on');
    searchResultAreaEl.append(ulEl);
    movieIds.push(movie.imdbID);
  })
  findSpanEls();
  headerInputEl.value = searchInputEl.value;
  headerSearch = 0;
  sectionSearch = 0;
}

// search버튼 눌렀을 때
// searchBtnEl.addEventListener('click', async () => {
//   page = 1;
//   const movies = await getMovie(searchInputEl.value, page);
//   page = 2;

//   const { Search, totalResult } = movies;
//   ulEl.innerHTML = '';
//   Search.forEach(movie => {
//     const liEl = document.createElement('li');
//     liEl.innerHTML = /* html */`
//       <img id="${movie.imdbID}" src="${movie.Poster}" alt="${movie.Title}" />
//       <div class="post-cover">
//         <span>View More</span>
//       </div>
//     `;
//     ulEl.append(liEl);
//     searchResultAreaEl.append(ulEl);
//   })
// });

// input 포커스 상태에서 enter 눌렀을 때
// searchInputEl.addEventListener('keydown', async (e) =>{
//   if (e.key == 'Enter') {
//     page = 1;
//     const movies = await getMovie(searchInputEl.value, page);
//     page = 2;

//     const { Search, totalResult } = movies;
//     ulEl.innerHTML = '';
//     Search.forEach(movie => {
//       const liEl = document.createElement('li');
//       liEl.innerHTML = /* html */`
//         <img id="${movie.imdbID}" src="${movie.Poster}" alt="${movie.Title}" />
//         <div class="post-cover">
//           <span>View More</span>
//         </div>
//       `;
//       ulEl.append(liEl);
//       searchResultAreaEl.append(ulEl);
//     })
//   }
// });


// 영화 더 요청하기
async function moreMovie() {
  if ( page === 1 || page > totalpages) return; // page가 1이거나 총페이지보다 크면 moreMovie() 종료
  dataLoadingEl.classList.add('on');
  const movies = await getMovie(searchInputEl.value, page);
  page += 1;

  const { Search } = movies;
  Search.forEach(movie => {
    const liEl = document.createElement('li');
    liEl.innerHTML = /* html */`
      <img id="${movie.imdbID}" src="${movie.Poster}" alt="${movie.Title}" />
      <div class="post-cover">
        <span>View More</span>
      </div>
    `;
    ulEl.append(liEl);
    dataLoadingEl.classList.remove('on');
    searchResultAreaEl.append(ulEl);
    movieIds.push(movie.imdbID);
  })
  findSpanEls()
}

// 최신 검색값 찾기 - 검색 시 검색영역 count
searchInputEl.addEventListener('keydown', (e) => {
  if ( e.keyCode == 13 ) {
    sectionSearch += 1;
  }
})
searchBtnEl.addEventListener('click', () => {
  sectionSearch += 1;
})
headerInputEl.addEventListener('keydown', (e) => {
  if ( e.keyCode == 13 ) {
    headerSearch += 1;
  }
})
headerBtnEl.addEventListener('click', () => {
  headerSearch += 1;
})

const popUpPostImgEl = document.querySelector('#popup .popup-poster-wrap .poster-area .detail-poster');
const popUpTitleEl = document.querySelector('#popup .popup-poster-wrap .poster_detail .detail-title');
const popUpGenreEl = document.querySelector('#popup .popup-poster-wrap .poster_detail .detail-genre');
const popUpDirectorEl = document.querySelector('#popup .popup-poster-wrap .poster_detail .detail-director');
const popUpActorsEl = document.querySelector('#popup .popup-poster-wrap .poster_detail .detail-actors');
const popUpReleasedEl = document.querySelector('#popup .popup-poster-wrap .poster_detail .detail-released');
const popUpRuntimeEl = document.querySelector('#popup .popup-poster-wrap .poster_detail .detail-runtime');
const popUpPlotEl = document.querySelector('#popup .popup-poster-wrap .poster_detail .detail-plot');
const popUpRatingEl = document.querySelector('#popup .popup-poster-wrap .poster_detail .detail-rating');

const popUpEl = document.querySelector('#popup');
const popUpCloseBtnEl = document.querySelector('#popup .popup-poster-wrap .popup-poster-area .popup_close-btn');

// span요소 찾고 클릭시 해당 영화정보 팝업 띄우기
async function findSpanEls() {
  spanEls = document.querySelectorAll('.result ul li .post-cover');
  spanEls.forEach((spanEl, index) => {
    spanEl.addEventListener('click', async () => {
      const movieInfos = await getMovieInfo(movieIds[index]);
      popUpEl.classList.add('on');
      popUpPostImgEl.src = movieInfos.Poster.replace('SX300', 'SX700');
      popUpPostImgEl.alt = movieInfos.Title;
      popUpTitleEl.innerHTML = movieInfos.Title;
      popUpGenreEl.innerHTML = 'Genre: ' + movieInfos.Genre;
      popUpDirectorEl.innerHTML = 'Director: ' + movieInfos.Director;
      popUpActorsEl.innerHTML = 'Actors: ' + movieInfos.Actors;
      popUpReleasedEl.innerHTML = 'Released: ' + movieInfos.Released;
      popUpRuntimeEl.innerHTML = movieInfos.Runtime;
      popUpPlotEl.innerHTML = movieInfos.Plot;
      popUpRatingEl.innerHTML = 'Rating: ' + movieInfos.imdbRating + ' / 10';
    })
  })
}
popUpCloseBtnEl.addEventListener('click', () => {
  popUpEl.classList.remove('on');
  document.body.classList.remove('scroll-prevent');
});

// 한글 입력 방지
function preventKrInput(event) {
  if (event.code == 'lang1') {
    return;
  } else if (event.key == 'Process') {
    searchInputEl.value = '';
    alert('영문만 입력 가능합니다.');
  }
}

// IntersectionObserver 사용해 무한 스크롤
const intersectionEl = document.querySelector('.more-movie-area');
const botOptions = {
  root: null, // 기본값(null), 뷰포트를 기준
  rootMargin: '-800px 0px 0px 0px', // 교차화면 박스 크기(상, 우, 하, 좌, 순서) / 기준은 뷰포트 기준
  threshold: 0.9 // 0.8 만큼의 영역이 교차(보이면)되면 observer실행 / 교차범위영역 0.0 ~ 1.0 값
}
const bottom = new IntersectionObserver(entry => {
  if ( entry[0].intersectionRatio >= 0.9 ) return moreMovie();
}, botOptions);

bottom.observe(intersectionEl);

// scroll 위치 값으로 고정 헤더 나타내기
const fixedHeaderBarEl = document.querySelector('.header-fixed-wrap');
window.addEventListener("scroll", (event) => {
  if ( this.scrollY >= 300) {
    fixedHeaderBarEl.classList.add('active');
  } else {
    fixedHeaderBarEl.classList.remove('active');
  }
}, {passive: true});
