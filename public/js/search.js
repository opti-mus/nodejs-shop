// const searchResult = document.querySelector('.search-result')
// const searchInput = document.querySelector('.header-search input')
// function getGoods() {
//   fetch('/get-all-goods', {
//     method: 'POST',
//   })
//     .then((res) => {
//       return res.text()
//     })
//     .then((body) => {
//       validData(JSON.parse(body))
//     })
// }
// getGoods()

// function validData(data) {
//   searchInput.oninput = function () {
//     let out = ''
//     let fault = ''
//     if (this.value == '') {
//       searchResult.innerHTML = ''
//       searchResult.classList.add('hide')
//     }
//     data.forEach((el) => {
//       if (this.value.length < 2) return false
//       else {
//         searchResult.classList.remove('hide')
//         if (
//           el.name.toLowerCase().indexOf(this.value) + 1 ||
//           el.name.indexOf(this.value) + 1
//         ) {
//           out += `<a href='/goods?id=${el.id}'>${el.name}</a>`
//         } else {
//           fault = `<a href='/goods?id=${el.id}'>Не удалось найти</a>`
//         }
//       }
//     })
//     if (!out) {
//       searchResult.innerHTML = fault
//     } else {
//       searchResult.innerHTML = out
//     }
//   }
// }

function search() {
  const searchResult = document.querySelector('.search-result')
  const searchInput = document.querySelector('.header-search input')

  searchInput.oninput = function () {
    let value = { name: this.value }
    searchGoods(value)
  }
  function drawOutputSearch(data) {
    let out = ''
    if (!data.length) out = `<a href='#'>Не удалось найти</a>`
    for (let i = 0; i < data.length; i++) {
      if (i > 8) break
      const el = data[i]
      searchResult.classList.remove('hide')
      out += `<a href='/goods?id=${el.id}'>${el.name}</a>`
    }
    searchResult.innerHTML = out
  }
  function searchGoods(data) {
    fetch('/search-goods', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((body) => drawOutputSearch(body))
  }
  document.onclick = function (e) {
    if (e.target != searchResult && e.target != searchInput) {
      searchResult.classList.add('hide')
    }
  }
}
search()

// class Search {
//   constructor(options) {
//     this.input = options.input
//     this.output = options.output
//     this._init()
//   }
//   showOutput() {
//     this.output.classList.remove('hide')
//   }
//   hideOuput() {
//     this.output.classList.add('hide')
//   }
//   _init() {
//     this.input.oninput = function () {
//       let value = { name: this.value }
//       this.searchGoods(value)
//     }
//   }
//   drawOutputSearch(data) {
//     let out = ''
//     if (!data.length) out = `<a href='#'>Не удалось найти</a>`
//     for (let i = 0; i < data.length; i++) {
//       if (i > 8) break
//       const el = data[i]
//       this.output.classList.remove('hide')
//       out += `<a href='/goods?id=${el.id}'>${el.name}</a>`
//     }
//     this.output.innerHTML = out
//   }
//   searchGoods(data) {
//     fetch('/search-goods', {
//       method: 'POST',
//       body: JSON.stringify(data),
//       headers: {
//         Accept: 'application/json',
//         'Content-type': 'application/json',
//       },
//     })
//       .then((res) => res.json())
//       .then((body) => this.drawOutputSearch(body))
//   }
// }
// const mySearch = new Search()
