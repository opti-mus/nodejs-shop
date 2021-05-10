
function getRating() {
    fetch('/get-all-rating', {
        method: 'POST'
    }).then((res) => {
        return res.text();
    }).then((body) => {
        validId(JSON.parse(body));
    })
}
getRating();

const validId = function (arr) {
    arr.forEach(el => {
        showRating(el.rating, el.id)
    })
}

const showRating = function (rating, id) {
    const allRating = document.querySelectorAll('.all-card-rating');

    allRating.forEach(el => {
        let currentId = el.dataset.goods_id;
        if (currentId == id) {
            el.querySelectorAll('i').forEach(item => {
                if (+item.dataset.rating <= +rating) {
                    item.classList.remove('far');
                    item.classList.add('fa');
                }
            })
        }
    })
}
// showRating(60, 1)