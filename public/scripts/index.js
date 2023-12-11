const likeButtons = [];



const showAnecsList = async () => {
    const url = new URL(window.location.href);

    let page = url.searchParams.get('page');
    if (!url.searchParams.get('page')) {
        page = '1';
    }

    // отображаем картинку только на первой странице
    if (page === '1') {
        const imgContainer = document.getElementById('imgContainer');
        imgContainer.style.display = "flex";
    }

    const response = await fetch(`/anecs?page=${page}&pageSize=20`, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });


    if (response.ok) {
        const data = await response.json();
        const anecs = data.anecs;


        let listContainer = document.querySelector(".anecs-list");
        anecs.forEach(anec => {
            showAnec(anec, listContainer);

            // добавление обработчика нажатия кнопки лайка
            const buttonId = "likeButton" + anec._id;
            const likeButton = document.getElementById(buttonId);


            // выставляем стили для нажатых кнопок лайка
            if (localStorage.getItem(buttonId)) {
                likeButton.classList.add('liked');
                likeButton.getElementsByClassName('like-button__icon')[0].classList.add('liked');
            }

            let isLikeInProgress = false;
            likeButton.addEventListener("click", async () => {
                if (isLikeInProgress) {
                    return;
                }

                // обработка нажатия лайка

                isLikeInProgress = true;

                if (localStorage.getItem(buttonId)) { // лайк уже поставлен
                    likeButton.classList.remove('liked');
                    likeButton.getElementsByClassName('like-button__icon')[0].classList.remove('liked');
                    localStorage.removeItem(buttonId)
                    await updateLikeCount(-1, anec);
                } else { // лайк еще не поставлен
                    likeButton.classList.add('liked');
                    likeButton.getElementsByClassName('like-button__icon')[0].classList.add('liked');
                    localStorage.setItem(buttonId, 'liked');
                    await updateLikeCount(1, anec);
                }

                isLikeInProgress = false;


            });

            likeButtons.push();

        });

        const numOfPages = data.totalPages;
        const pagesList = document.getElementById('pagesList');
        let pages = '';
        for (let i = 1; i <= numOfPages; i++) {
            pages += showPageNumber(i, page);
        }
        pagesList.insertAdjacentHTML("beforeend", pages);

    }


}

// обновление количества лайков
const updateLikeCount = async (change, anec) => {
    const likeValue = document.getElementById("likeValue" + anec._id);
    const response = await fetch("/anecs/" + anec._id, {
        method: "PATCH",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            change: change,
        }),
    });
    anec.likes += change;

    likeValue.innerHTML = anec.likes
}


const showPageNumber = (num, currentPage) => {
    const cl = num == currentPage ? "pages-list__item current" : "pages-list__item";
    return `<div class="${cl}">
                <a href=/?page=${num}>${num}</a>
            </div>`;
}

// добавление контейнера с анекдотом на главную станицу 
const showAnec = (anec, listContainer) => {
    let anecHTML = `<div class="anec">
                                <div class="anec__text" id="anecText${anec._id}"></div>
                                <div class="anec__footer">
                                    <button id="likeButton${anec._id}" class="like-button">
                                        <svg class="like-button__icon" width="1.5rem" height="1.5rem" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M14 20.408c-.492.308-.903.546-1.192.709-.153.086-.308.17-.463.252h-.002a.75.75 0 01-.686 0 16.709 16.709 0 01-.465-.252 31.147 31.147 0 01-4.803-3.34C3.8 15.572 1 12.331 1 8.513 1 5.052 3.829 2.5 6.736 2.5 9.03 2.5 10.881 3.726 12 5.605 13.12 3.726 14.97 2.5 17.264 2.5 20.17 2.5 23 5.052 23 8.514c0 3.818-2.801 7.06-5.389 9.262A31.146 31.146 0 0114 20.408z" />
                                        </svg>
                                        <div id="likeValue${anec._id}" class="like-button__value">${anec.likes}</div>
                                    </button>
                                </div>
                            </div>`;


    listContainer.insertAdjacentHTML("beforeend", anecHTML);

    // добавление текста анекдота
    let lineDiv;
    let anecText = document.getElementById(`anecText${anec._id}`);
    for (let line of anec.text) {
        lineDiv = document.createElement('div');
        lineDiv.textContent = line;
        anecText.appendChild(lineDiv);
    }

}



