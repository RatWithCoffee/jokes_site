const submitButton = document.getElementById("submitButton");
const textarea = document.getElementById("textarea");
submitButton.addEventListener("click", async function addAnec() {
    let text = textarea.value;
    if (text === '') {
        
    } else {
        modal.style.display = "block";

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


});

const modal = document.getElementById("modal");
const addAnecButton = document.getElementById("addAnecButton");
const toHomeButton = document.getElementById("toHomeButton");


addAnecButton.onclick = function () {
    textarea.value = '';
    modal.style.display = "none";
}

toHomeButton.onclick = function () {
    window.location.href = '/';
}


