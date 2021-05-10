const myForm = document.querySelector('.reg-main')

function serialize(form) {
  if (!form || form.nodeName !== 'FORM') return false
  let i,
    j,
    q = []
  let of = {}
  let arr = []
  for (i = form.elements.length - 1; i >= 0; i = i - 1) {
    if (form.elements[i].name === '') {
      continue
    }
    switch (form.elements[i].nodeName) {
      case 'INPUT':
        switch (form.elements[i].type) {
          case 'text':
          case 'tel':
          case 'email':
          case 'hidden':
          case 'password':
          case 'button':
          case 'reset':
          case 'submit':
            q.push(
              form.elements[i].name +
                '=' +
                encodeURIComponent(form.elements[i].value)
            )
            of[form.elements[i].name] = encodeURIComponent(
              form.elements[i].value
            )
            break
          case 'checkbox':
          case 'radio':
            if (form.elements[i].checked) {
              q.push(
                form.elements[i].name +
                  '=' +
                  encodeURIComponent(form.elements[i].value)
              )
            }
            break
        }
        break
      case 'file':
        break
      case 'TEXTAREA':
        q.push(
          form.elements[i].name +
            '=' +
            encodeURIComponent(form.elements[i].value)
        )
        break
      case 'SELECT':
        switch (form.elements[i].type) {
          case 'select-one':
            arr.push(encodeURIComponent(form.elements[i].value))
            break
          case 'select-multiple':
            for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
              if (form.elements[i].options[j].selected) {
                q.push(
                  form.elements[i].name +
                    '=' +
                    encodeURIComponent(form.elements[i].options[j].value)
                )
              }
            }
            break
        }
        break
      case 'BUTTON':
        switch (form.elements[i].type) {
          case 'reset':
          case 'submit':
          case 'button':
            q.push(
              form.elements[i].name +
                '=' +
                encodeURIComponent(form.elements[i].value)
            )
            of[form.elements[i].name] = encodeURIComponent(
              form.elements[i].value
            )
            break
        }
        break
    }
  }
  return of
}
document.querySelector('#finish-reg').onclick = () => {
  let form = serialize(myForm)
  fetch('/finish-reg', {
    method: 'POST',
    body: JSON.stringify(form),
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
  })
    .then((res) => {
      return res.json()
    })
    .then((body) => {
      if (body.length <= 0) {
        fetch('/reg-user', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(serialize(myForm)),
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
        })
          .then((res) => {
            return res.json()
          })
          .then((body) => {
            Swal.fire({
              icon: 'success',
              title: 'Вы успешно зарегались!',
              confirmButtonText: 'На главную',
            })
            Swal.getConfirmButton().onclick = () => (window.location.href = '/')
          })
      } else {
        Toast.fire({
          title: 'Такой email уже есть!',
          icon: 'error',
        })
      }
    })
}
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
})
