document.querySelectorAll('.user-scale i').forEach((el) => {

    el.onclick = function () {
        ajaxUpdate(this.dataset.goods_id);
    }


})
document.querySelector('.head-compare__button').onclick = () => {
    console.log('ok');
}
function showScale(data, id) {
    const nav = document.querySelector('.nav-compare');
    let out = '';
    data.forEach((el) => {
        if (el.id == id) {
            out += `<div class='campare-el'>`;
            out += `<a href="/goods?id=${el.id}" class="cart__nav_image"><img src='images/${el.image}'></a>`;
            out += `<a href="/goods?id=${el.id}"> ${el.name} </a><br>`;
            out += `</div>`;
            return;
        }
    })
    nav.innerHTML += out;
}
function ajaxUpdate(id) {
    fetch('/compare', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        }
    })
        .then((res) => {
            return res.json()
        })
        .then((body) => {
            showScale(body, id)
        })
}