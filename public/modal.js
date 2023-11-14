let modal = document.getElementById("modal");

let submitButton = document.getElementById("submitButton");
let addAnecButton = document.getElementById("addAnecButton");
let toHomeButton = document.getElementById("toHomeButton");


// When the user clicks on the button, open the modal
submitButton.onclick = function () {
    modal.style.display = "block";
}

addAnecButton.onclick = function () {
    modal.style.display = "none";
}

toHomeButton.onclick = function () {
    window.location.href = '/';
}