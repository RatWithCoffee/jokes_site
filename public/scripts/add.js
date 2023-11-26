

const addFrom = document.getElementById("addForm");

const anecTextarea = document.getElementById("anecTextarea");
const errorAnecTextarea = document.getElementById("emptyText");

const agreementCheck = document.getElementById("agreementCheck");
const errorAgreementCheck = document.getElementById("emptyAgreement");


addFrom.addEventListener('submit', validateAndSubmit);

async function validateAndSubmit(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    clearErrorMessages();

    if (!anecTextarea.validity.valid) {
        errorAnecTextarea.classList.add('invalid');
        anecTextarea.classList.add('invalid');
    }
    if (!agreementCheck.validity.valid) {
        errorAgreementCheck.classList.add('invalid');
        agreementCheck.classList.add('invalid');
    }

    if (addFrom.checkValidity()) {
        await submitForm();
        modal.style.display = "block";;
    }
}


function clearErrorMessages() {
    errorAgreementCheck.classList.remove('invalid');
    anecTextarea.classList.remove('invalid');
    errorAnecTextarea.classList.remove('invalid');
    agreementCheck.classList.remove('invalid');

}


async function submitForm() {
    let text = anecTextarea.value;
    let lineArr = text.split("\n");

    const response = await fetch("/new_anecs", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            text: lineArr,
            likes: 0
        })
    });

}

const modal = document.getElementById("modal");
const addAnecButton = document.getElementById("addAnecButton");
const toHomeButton = document.getElementById("toHomeButton");


addAnecButton.onclick = function () {
    anecTextarea.value = '';
    agreementCheck.checked = false;
    modal.style.display = "none";
}

toHomeButton.onclick = function () {
    window.location.href = '/';
}




