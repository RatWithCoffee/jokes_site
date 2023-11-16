const submitButton = document.getElementById("submitButton");
const textarea = document.getElementById("textarea");
submitButton.addEventListener("click", async function addAnec() {
    let text = textarea.value;

    if (text === '') {
        
    }
   
    let lineArr = text.split("\n");

    const response = await fetch("/anecs", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            text: lineArr,
            likes: 0
        })
    });


});

const modal = document.getElementById("modal");
const addAnecButton = document.getElementById("addAnecButton");
const toHomeButton = document.getElementById("toHomeButton");


submitButton.onclick = function () {
    modal.style.display = "block";
}

addAnecButton.onclick = function () {
    textarea.value = '';
    modal.style.display = "none";
}

toHomeButton.onclick = function () {
    window.location.href = '/';
}


