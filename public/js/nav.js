window.onresize = dinamicResize

function toggleNav() {
  let nav = document.querySelector('.site-nav')
  let foundation = document.querySelector('.foundation')
  let btnNav = document.querySelector('.toggle-nav')

  btnNav.addEventListener('click', () => {
    if (window.innerWidth < 1174) {
      nav.classList.toggle('hide-nav')
    } else {
      nav.classList.toggle('hide-nav')
      foundation.classList.toggle('slide-nav')
    }
  })
}
function dinamicResize() {
  let nav = document.querySelector('.site-nav')
  let foundation = document.querySelector('.foundation')

  if (window.innerWidth < 1174) {
    nav.classList.add('hide-nav')
    foundation.classList.remove('slide-nav')
  }
}
dinamicResize()
toggleNav()
function getCategoryLit() {
  fetch('/get-category-list', {
    method: 'POST',
  })
    .then(function (response) {
      return response.text()
    })
    .then(function (body) {
      showCategoryList(JSON.parse(body))
    })
}

function showCategoryList(data) {
  let out = '<ul class="category-list"><li><a href="/">Главная</a></li>'
  for (let i = 0; i < data.length; i++) {
    out += `<li><a href="/cat?id=${data[i]['id']}">${data[i]['category']}</a></li>`
  }
  out += '</ul>'
  document.querySelector('#category-list').innerHTML = out
}
getCategoryLit()
