

const addFrom = document.getElementById("addForm");

const anecTextarea = document.getElementById("anecTextarea");
const errorAnecTextarea = document.getElementById("emptyText");

const agreementCheck = document.getElementById("agreementCheck");
const errorAgreementCheck = document.getElementById("emptyAgreement");


const modalOk = document.getElementById("modalOk");
const modalLimitExceeded = document.getElementById("modalLimitExceeded");
const addAnecButton = document.getElementById("addAnecButton");
const toHomeButtonOk = document.getElementById("toHomeButtonOk");
const toHomeButtonLimitExceeded = document.getElementById("toHomeButtonLimitExceeded");


addAnecButton.onclick = () => {
    anecTextarea.value = '';
    agreementCheck.checked = false;
    modalOk.style.display = "none";
    modalLimitExceeded.style.display = "none";
}

const redirectToHome = () => {
    window.location.href = '/';
}

toHomeButtonOk.onclick = toHomeButtonLimitExceeded.onclick = redirectToHome;


const clearErrorMessages = () => {
    errorAgreementCheck.classList.remove('invalid');
    anecTextarea.classList.remove('invalid');
    errorAnecTextarea.classList.remove('invalid');
    agreementCheck.classList.remove('invalid');

}


const submitForm = async () => {

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

    if (response.status === 429) {
        modalLimitExceeded.style.display = "block";
    } else {
        modalOk.style.display = "block";
    }

}

const validateAndSubmit = async (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    clearErrorMessages();

    isValid = true;
    if (!anecTextarea.validity.valid || trim(anecTextarea.value) === '') {
        isValid = false;
        errorAnecTextarea.classList.add('invalid');
        anecTextarea.classList.add('invalid');
    }
    if (!agreementCheck.validity.valid) {
        errorAgreementCheck.classList.add('invalid');
        agreementCheck.classList.add('invalid');
    }

    if (addFrom.checkValidity() && isValid) {
        await submitForm();

    }
}

const trim = (str) => {
    return str.replace(/^\s+|\s+$/g,"");

}

addFrom.addEventListener('submit', validateAndSubmit);









