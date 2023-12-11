
const showAnecsList = async () => {
    const response = await fetch('/new_anecs', {
        method: "GET",
        headers: { "Accept": "application/json" }
    });



    if (response.ok) {
        let listContainer = document.querySelector(".anecs-list");
        anecs = await response.json();

        console.log(anecs)

        anecs.forEach(anec => {
            showAnec(anec, listContainer);
        });
    }


}

// удаление анекдота из предложки 
const deleteAction = async (id) => {
    const response = await fetch("/new_anecs/" + id, {
        method: "DELETE",
        headers: { "Accept": "application/json" },
    });

}

// добавление анекдота из предложки 
const addAction = async (text) => {
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
 const showAnec = (anec, listContainer) => {
    let anecHTML = `<div class="anec">
                        <textarea class="edit-textarea" id="anecText${anec._id}"></textarea>
                        <div class="rb-container">
                            <div>
                                <input type="radio" id="later${anec._id}" name="${anec._id}" value="later" checked/>
                                <label for="later${anec._id}">Рассмотрим позже</label>
                            </div>

                            <div>
                                <input type="radio" id="add${anec._id}" name="${anec._id}" value="add"/>
                                <label for="add${anec._id}">Добавить</label>
                            </div>
                    
                            <div>
                                <input type="radio" id="delete${anec._id}" name="${anec._id}" value="delete"  />
                                <label for="delete${anec._id}">Удалить</label>
                            </div> 
                        </div>
                    </div>`;


    listContainer.insertAdjacentHTML("beforeend", anecHTML);

    // добавление текста анекдота
    let text = '';
    let anecText = document.getElementById(`anecText${anec._id}`);
    for (let line of anec.text) {
        text += line;
        text += '\n';
    }
    anecText.textContent = text;

}



// обработчик для кнопки сохранения изменений
document.addEventListener('DOMContentLoaded', () => {
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


