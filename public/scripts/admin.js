async function showAnecsList() {
    const response = await fetch('/new_anecs', {
        method: "GET",
        headers: { "Accept": "application/json" }
    });

    if (response.ok) {
        let listContainer = document.querySelector(".anecs-list");
        anecs = await response.json();

        anecs.forEach(anec => {
            showAnec(anec, listContainer);
        });
    }


}

// удаление анекдота из предложки 
async function deleteAction(id) {
    const response = await fetch("/new_anecs/" + id, {
        method: "DELETE",
        headers: { "Accept": "application/json" },
    });

}

// добавление анекдота из предложки 
async function addAction(text) {
    const response = await fetch('/anecs', {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            text: text,
            likes: 0
        })
    });
}

// добавление контейнера с анекдотом на страницу 
function showAnec(anec, listContainer) {
    let anecHTML = `<div class="anec">
                        <textarea class="anec__text" id="anecText${+anec.id}"></textarea>
                        <div class="anec__footer">
                            <div>
                                <input type="radio" id="later${anec.id}" name="${anec.id}" value="later" checked/>
                                <label for="later${anec.id}">Рассмотрим позже</label>
                            </div>

                            <div>
                                <input type="radio" id="add${anec.id}" name="${anec.id}" value="add"/>
                                <label for="add${anec.id}">Добавить</label>
                            </div>
                    
                            <div>
                                <input type="radio" id="delete${anec.id}" name="${anec.id}" value="delete"  />
                                <label for="delete${anec.id}">Удалить</label>
                            </div> 
                        </div class="anec__footer">
                    </div>`;


    listContainer.insertAdjacentHTML("beforeend", anecHTML);

    // добавление текста анекдота
    let text = '';
    let anecText = document.getElementById(`anecText${+anec.id}`);
    for (let line of anec.text) {
        text += line;
        text += '\n';
    }
    anecText.textContent = text;

}



// обработчик для кнопки сохранения изменений
document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener("click", () => {
        var radioButtons = document.querySelectorAll('input[type="radio"]');
        for (const radioButton of radioButtons) {
            if (radioButton.checked) {
                if (radioButton.value === 'add') {
                    addAction(document.getElementById(`anecText${radioButton.name}`).value.split("\n"));
                    deleteAction(radioButton.name);
                } else if (radioButton.value === 'delete') {
                    deleteAction(radioButton.name);
                }
            }
        }

        location.reload();
    });
});


