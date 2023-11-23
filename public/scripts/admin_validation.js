// document.getElementById('adminValidationButton').addEventListener('submit', (event) => {
    

// });

function validate() {
    const errorMessage = document.getElementById('errorMessage');
    // errorMessage.innerHTML = '';

    const password = document.getElementById('password').value;
    validatePassword(password);
}


async function validatePassword(pass) {

    const response = await fetch("/admin", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            password: pass,
        })
    });

    if (response.ok) {
        window.location.href = "/admin.html";
    } else {
        errorMessage.innerHTML = 'Ашибка';
    }
    
}