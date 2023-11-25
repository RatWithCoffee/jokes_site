// const myform = document.getElementById("adminValidationForm");


// myform.addEventListener('submit', validateForm);

// async function validateForm(e) {
//     const
//       form = e.target,
//       field = Array.from(form.elements);
  
//     // сброс полей
//     field.forEach(i => {
//       i.setCustomValidity('');
//       i.parentElement.classList.remove('invalid');
//     });
  
//     // email или телефон заданы?
//     const err = form.password.value ? '' : 'error';
//     form.password.setCustomValidity(err);
//     const isValid = await isValidPassword();
//     if (!isValid) {
//         form.password.setCustomValidity('error');
//     } 
  
//     if (!form.checkValidity()) {
        
//       // форма не прошла валидацию - отмена отправки
//       e.preventDefault();
//       e.stopImmediatePropagation();
  
//       // добавляем класс invalid
//       field.forEach(i => {
//         if (!i.checkValidity()) {
//           // поле не прошло валидацию - добавляем класс
//           i.parentElement.classList.add('invalid');
//         }
//       });
//     } else {
//         window.location.href = 'admin.html';
//     }
//   }
// async function isValidPassword() {
//     const response = await fetch("/admin", {
//         method: "POST",
//         headers: { "Accept": "application/json", "Content-Type": "application/json" },
//         body: JSON.stringify({
//             password: password,
//         })
//     });

//     return response.ok;
// }