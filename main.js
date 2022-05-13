async function getMovie(name, page = 1) {
  let res = await fetch(`https://www.omdbapi.com?apikey=7035c60c&s=${name}&page=${page}`)
  res = await res.json()
  
  console.log(page);
  return res
}
function renderMovie(movies, isFirst) {
  //
}

let page = 1
let totalResults = 0
const searchEl = document.querySelector('input')
const searchBtnEl = document.querySelector('button.search-btn')
const ulEl = document.querySelector('ul')

searchBtnEl.addEventListener('click', async () => {
  page = 1
  const movies = await getMovie(searchEl.value, page)
  page = 2
  
  const { Search, totalResults } = movies
  
  console.log(Search)
  console.log(movies)
  console.log(typeof totalResults) // 'number'?
  // Nu..parseI.t()
  
  // renderMovie(movies, true)
  // if (isFirst) { ...
  ulEl.innerHTML = '' // ??
  Search.forEach(movie => {
    const liEl = document.createElement('li')
    liEl.innerHTML = `<img src="${movie.Poster}" alt="${movie.Title}"/>`
    ulEl.append(liEl)
  })
})
const moreBtnEl = document.querySelector('button.more-btn')

moreBtnEl.addEventListener('click', async () => {
  if (page === 1) return // ??
  const movies = await getMovie(searchEl.value, page)
  page += 1

  const { Search, totalResults } = movies
  Search.forEach(movie => {
    const liEl = document.createElement('li')
    liEl.innerHTML = `<img src="${movie.Poster}" alt="${movie.Title}"/>`
    ulEl.append(liEl)
  })
  // renderMovie(movies)
})
