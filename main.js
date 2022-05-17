// 영화 정보 가져오기
const API_KEY = '7035c60c';
async function getMovie(name, page = 1) {
  let res = await fetch(`https://www.omdbapi.com?apikey=${API_KEY}&s=${name}&page=${page}`);
  res = await res.json();

  return res;
}
// 검색한 영화 제목, 연관된 영화 개수 산정
function searchInfoOn(title, total) {
  const infoEl = document.querySelector('.result .search-info-area');
  console.log(total);
  searchTitleEl.innerHTML = title.value;
  totalResultsEl.innerHTML = total;

  infoEl.classList.add('on');
}

// 총 페이지 산정 (10개 = 1페이지)
function totalPage(total) {
  totalpages = parseInt(total / 10);
  if (total % 10 !== 0) totalpages += 1;
  console.log(totalpages)
  return totalpages;
}

const searchInputEl = document.querySelector('.search .search-area input');
const searchBtnEl = document.querySelector('.search .search-area .search-btn');

const totalResultsEl = document.querySelector('.result .search-info-area .search-total');
const searchTitleEl = document.querySelector('.result .search-info-area .search-title');

const ulEl = document.createElement('ul');
const searchResultAreaEl = document.querySelector('section.result .inner');

const dataLoadingEl = document.querySelector('.more-movie-area .intersection-area .loader');

let page = 1;
let totalpages = 0;
let movieIds = [];

// 인라인 방식
async function requestMovie(){
  if (searchInputEl.value.trim() == '' || searchInputEl.value.trim() == ' ') return searchInputEl.value = '';
  dataLoadingEl.classList.add('on');
  page = 1;
  movieIds = [];
  const movies = await getMovie(searchInputEl.value, page);
  page = 2;

  const { Search, totalResults } = movies;
  const total = parseInt(totalResults);
  console.log(movies);
  searchInfoOn(searchInputEl, total);
  totalPage(total);
  
  ulEl.innerHTML = '';
  Search.forEach(movie => {
    const liEl = document.createElement('li');
    liEl.innerHTML = /* html */`
      <img id="${movie.imdbID}" src="${movie.Poster}" alt="${movie.Title}" />
      <div class="post-cover">
        <span>View More</span>
      </div>
    `;
    dataLoadingEl.classList.remove('on');
    ulEl.append(liEl);
    searchResultAreaEl.append(ulEl);
    movieIds.push(movie.imdbID);
  })
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
// 한글 입력 방지
function preventKrInput(event) {
  if (event.code == 'lang1') {
    return;
  } else if (event.key == 'Process') {
    searchInputEl.value = '';
    alert('영문만 입력 가능합니다.');
  }
}

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
    dataLoadingEl.classList.remove('on');
    ulEl.append(liEl);
    searchResultAreaEl.append(ulEl);
    movieIds.push(movie.imdbID);
  })
}

// IntersectionObserver 사용해 무한 스크롤
const intersectionEl = document.querySelector('.more-movie-area');
const options = {
  root: null, // 기본값(null), 뷰포트를 기준
  rootMargin: '-800px 0px 0px 0px',
  threshold: 0.9 // 0.8 만큼의 영역이 교차(보이면)되면 observer실행 / 교차범위영역 0.0 ~ 1.0 값
}
const io = new IntersectionObserver(entry => {
  if ( entry[0].intersectionRatio >= 0.9 ) {
    console.log(entry[0].intersectionRatio);
    // console.log(observer.threshold);
    console.log(entry)
    // console.log(observer)
    moreMovie();
  }
}, options);

io.observe(intersectionEl);

