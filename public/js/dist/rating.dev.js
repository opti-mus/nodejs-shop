"use strict";

// let lsRating = {};
// document.querySelectorAll('.all-card-rating').forEach((el) => {
//     el.onmouseenter = function (e) {
//         let hr = e.target.dataset.goods_id;
//         if (checkLs(hr)) return false;
//         let child = [...e.target.children];
//         child.forEach((item, inx, arr) => {
//             item.onmouseenter = function () {
//                 if (checkLs(hr)) return false;
//                 item.onclick = function (e) {
//                     let id = e.target.parentNode.dataset.goods_id;
//                     lsRating[id] = this.dataset.rating;
//                     localStorage.setItem('id', JSON.stringify(lsRating));
//                 }
//                 arr.forEach((el, ind) => {
//                     if (inx < ind) {
//                         toggleClazz(el, 'fa', 'far');
//                         return;
//                     };
//                     toggleClazz(el, 'far', 'fa');
//                 })
//             }
//         })
//     }
// })
// function checkLs(id) {
//     let rating = localStorage.getItem('id');
//     rating = JSON.parse(rating);
//     for (let key in rating) {
//         if (id == key) return true;
//     }
// }
// function showRating() {
//     document.querySelectorAll('.all-card-rating').forEach((el) => {
//         let id = el.dataset.goods_id;
//         let rating = localStorage.getItem('id');
//         rating = JSON.parse(rating);
//         for (let key in rating) {
//             if (key == id) {
//                 let child = [...el.children];
//                 child.forEach((chil) => {
//                     if (+chil.dataset.rating <= +rating[key]) {
//                         toggleClazz(chil, 'far', 'fa');
//                     }
//                 })
//             }
//         }
//     })
// }
// function toggleClazz(el, cl1, cl2) {
//     el.classList.remove(cl1);
//     el.classList.add(cl2);
// }
// showRating();
function getGoods() {
  fetch('/get-all-rating', {
    method: 'POST'
  }).then(function (res) {
    return res.text();
  }).then(function (body) {
    validId(JSON.parse(body));
  });
}

getGoods();

var validId = function validId(arr) {
  arr.forEach(function (el) {
    showRating(el.rating, el.id);
  });
};

var showRating = function showRating(rating, id) {
  var allRating = document.querySelectorAll('.all-card-rating');
  allRating.forEach(function (el) {
    var currentId = el.dataset.goods_id;

    if (currentId == id) {
      el.querySelectorAll('i').forEach(function (item) {
        if (+item.dataset.rating <= +rating) {
          item.classList.remove('far');
          item.classList.add('fa');
        }
      });
    }
  });
}; // showRating(60, 1)