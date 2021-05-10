document.querySelector('#lite-shop-order').onsubmit = function (e) {
  e.preventDefault();
  console.log('ok')
  let username = document.querySelector('#username').value.trim();
  let phone = document.querySelector('#phone').value.trim();
  let email = document.querySelector('#email').value.trim();
  let adress = document.querySelector('#address').value.trim();

  if(!document.querySelector('#rule').checked) {
    Swal.fire({
      title: 'Вы не прочитали правила!',
      text: 'Прочтите правила',
      type: 'error',
      confirmButtonText: 'Продолжить'
    })
    return false;
  } 
  if (username == '' || phone == '' || email == '' || adress == '' ){
    Swal.fire({
      title: 'Заполните все поля!',
      text: '',
      type: 'error',
      confirmButtonText: 'Продолжить'
    })
    return false;
  }

  fetch('/finish-order',{
    method: 'POST',
    body: JSON.stringify({
      'username': username,
      'phone': phone,
      'email': email,
      'address' : adress,
      cart : JSON.parse(localStorage.getItem('cart'))
    }),
    headers : {
       'Accept': 'application/json',
       'Content-type': 'application/json'
    }
  })
  .then(function (response) {
    return response.text();
  })
  .then(function (body) {
    if(body == 1){
      Swal.fire({
        title: 'Ваш заказ принят!',
        text: 'Ваш заказ обработается в течении дня',
        type: 'success',
        confirmButtonText: 'Продолжить'
      })
    } else {
      Swal.fire({
        title: 'Не удалось отправить заказ!',
        text: 'Повторите запрос позже',
        type: 'error',
        confirmButtonText: 'Продолжить'
      })
    }
  })
}