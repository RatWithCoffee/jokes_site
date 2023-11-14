const addButton = document.getElementById("addButton");
addButton.addEventListener("click", async function addAnec() {
    let text = document.getElementById("textarea").value;
   
    let lineArr = text.split("\n");

    const response = await fetch("/anecs", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            text: lineArr,
            likes: 0,
        })
    });


});


