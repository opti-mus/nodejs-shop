let cart = {};

document.querySelectorAll('.add-to-cart').forEach(function (el) {
  el.addEventListener('click', addToCart)
  el.addEventListener('click', modalCart)
});
if (localStorage.getItem('cart')) {
  cart = JSON.parse(localStorage.getItem('cart'));
  ajaxGetGoodsInfo()
}

function addToCart() {
  let goodsId = this.dataset.goods_id;
  if (cart[goodsId]) {
    cart[goodsId]++
  } else {
    cart[goodsId] = 1;
  }
  ajaxGetGoodsInfo();
}

function ajaxGetGoodsInfo() {
  updateLS();
  fetch('/get-goods-info', {
    method: 'POST',
    body: JSON.stringify({
      key: Object.keys(cart)
    }),
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    }
  }).then(function (response) {
    return response.text();
  }).then(function (body) {
    showCart(JSON.parse(body))
  })
}

function showCart(data) {
  let out = '';
  let total = 0;
  if (Object.keys(cart).length == 0) {
    document.querySelector('.cart-page').innerHTML = 'Ваша корзина пустая!';
    return false;
  }
  for (let key in cart) {
    out += `<div class="cart__nav">`
    out += `<div class="cart__nav_delete" data-goods_id = "${key}">X</div>`;
    out += `<a href="/goods?id=${key}" class="cart__nav_image"><img src='images/${data[key]['image']}'></a>`;
    out += `<a href="/goods?id=${key}" class="cart__nav_name"> ${data[key]['name']} </a>`;
    out += `<div class="cart__nav_value">`;
    out += `<i class="fas fa-minus cart__nav_minus" data-goods_id = "${key}"></i>`;
    out += `<div>${cart[key]}</div>`;
    out += `<i class="fas fa-plus cart__nav_plus" data-goods_id = "${key}"></i>`;
    out += `</div>`;
    out += `<div class="cart__nav_price">${formatPrice(data[key]['cost'])} грн</div>`;
    out += `</div></div>`;
    total += cart[key] * data[key]['cost'];

  }
  out += "</div>"
  out += `<div class="cart__nav_choice">`
  out += `<a href="#" data-close_modal="true">Продолжить покупки</a>`;
  if (total != 0) out += `<div class='cart__nav_total'>Total: ${formatPrice(total)} грн</div>`;
  else out = '';
  out += `<a href="/order"><button>Купить</button></a>`;
  out += `</div>`;
  document.querySelector('.cart-page').innerHTML = out;
  document.querySelectorAll('.cart__nav_plus').forEach(function (el) {
    el.onclick = cartPlus;
  });
  document.querySelectorAll('.cart__nav_minus').forEach(function (el) {
    if (cart[el.dataset.goods_id] === 1) {
      el.style.color = '#E0E0E0';
      el.onclick = null;
    }
    el.onclick = cartMinus;
  });
  document.querySelectorAll('.cart__nav_delete').forEach(function (el) {
    el.onclick = function () {
      cartDelete(this, out)
    };
  })
};

function cartDelete(el, data) {
  let goodsId = el.dataset.goods_id;

  delete(cart[goodsId])

  ajaxGetGoodsInfo();
}


function cartPlus() {
  let goodsId = this.dataset.goods_id;
  cart[goodsId]++;
  ajaxGetGoodsInfo();
}

function cartMinus() {
  let goodsId = this.dataset.goods_id;
  if (cart[goodsId] == 1) {
    return false;
  }
  if (cart[goodsId] - 1 > 0) cart[goodsId]--;
  else delete(cart[goodsId]);

  ajaxGetGoodsInfo();
}

function updateLS() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function formatPrice(price) {
  return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
}

function modalCart(e) {
  if (Object.keys(cart).length === 0) return false;

  document.body.style.overflow = 'hidden';
  let cartField = document.querySelector('.cart-head__field');
  let cartPage = document.querySelector('.cart-page');
  cartField.classList.remove('hide-cart-modal');
  cartField.onclick = function (e) {
    if (e.target == cartField) {
      hideModal();
    };
  }
  cartPage.onclick = function (e) {
    if (e.target.dataset.close_modal) {
      hideModal();
    }
  }
  document.querySelector('.cart__nav').onclick = (e) => {
    e.preventDefault();
  }

  function hideModal() {
    cartField.classList.add('hide-cart-modal');
    document.body.style.overflow = 'auto';
  }
}
document.querySelector('.head-cart__button').onclick = modalCart;