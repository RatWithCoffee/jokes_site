const likeButtons = [];

async function showAnecsList() {
    let pathname = (window.location.pathname);
    let endpoint = '/anecs' + pathname;

    console.log(endpoint);
    const response = await fetch(endpoint, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });

  

    if (response.ok) {
        let listContainer = document.querySelector(".anecs-list");
        anecs = await response.json();
        console.log(anecs);
        anecs.forEach(anec => {
            showAnec(anec, listContainer);

            // добавление обработчика нажатия кнопки лайка
            const buttonId = "likeButton" + anec.id;
            const likeButton = document.getElementById(buttonId);
            const likeValue = document.getElementById("likeValue" + anec.id);

            // выставляем стили для нажатых кнопок лайка
            if (localStorage.getItem(buttonId)) {
                likeButton.classList.add('liked');
            }

            likeButton.addEventListener("click", async function () {
                let change;
                // обработка нажатия лайка 
                if (localStorage.getItem(buttonId)) { // лайк уже поставлен
                    likeButton.classList.remove('liked');
                    localStorage.removeItem(buttonId)
                    change = -1;
                } else { // лайк еще не поставлен
                    likeButton.classList.add('liked');
                    localStorage.setItem(buttonId, 'liked');
                    change = 1;
                }


                const response = await fetch("/anecs/" + anec.id, {
                    method: "PATCH",
                    headers: { "Accept": "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({
                        likes: parseInt(likeValue.innerHTML) + change,
                    })
                });

                if (response.ok) {
                    let data = await response.json();
                    likeValue.innerHTML = data.likes;
                }
            });

            likeButtons.push();
        });
    }


}

// добавление контейнера с анекдотом на главную станицу 
function showAnec(anec, listContainer) {
    let anecHTML = `<div class="anec">
                                <div class="anec__text" id="anecText${+anec.id}"></div>
                                <div class="anec__footer">
                                    <div id="likeValue${+anec.id}" class="anec__likes">${anec.likes}</div>
                                    <button id="likeButton${+anec.id}" class="anec__like_button">Тупа лайк</button>    
                                </div class="anec__footer">
                            </div>`;


    listContainer.insertAdjacentHTML("beforeend", anecHTML);

    // добавление текста анекдота
    let lineDiv;
    let anecText = document.getElementById(`anecText${+anec.id}`);
    for (let line of anec.text) {
        lineDiv = document.createElement('div');
        lineDiv.textContent = line;
        anecText.appendChild(lineDiv);
    }

}



