const socket = io();
let user;
let isLogin = false;
// DOM elements
let message = document.getElementById("message");
let username = document.getElementById("username");
let btn = document.getElementById("send");
let output = document.getElementById("output");
let actions = document.getElementById("actions");

// Logueo de Usuario
Swal.fire({
  title: "Identificate",
  input: "email",
  text: "Ingresa un correo valido para identificarte en el chat",
  inputValidator: (value) => {
    // Expresion regular para comprobar si es un correo
    const expReg =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    const isEmail = expReg.test(value);
    return !isEmail && "Necesitas escribir un correo valido para continuar";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  username.value = user;
  isLogin = true;
  socket.emit("authenticated", user);
});

// Enviar Mensaje con Enter
message.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (message.value.trim().length > 0) {
      socket.emit("message", {
        user: username.value,
        message: message.value,
      });
      message.value = "";
    }
  }
});
// Enviar Mensaje con Boton
btn.addEventListener("click", () => {
  if (message.value.trim().length > 0) {
    socket.emit("message", {
      user: username.value,
      message: message.value,
    });
    message.value = "";
  }
});

//Socket Listeners
socket.on("messageLogs", (data) => {
  actions.innerHTML = `  `;
  if (!user) return;
  let messages = "";
  data.forEach((message) => {
    messages = messages + `${message.user} dice: ${message.message}<br>`;
  });
  output.innerHTML = messages;
});

// Usuario tipeando
message.addEventListener("keypress", () => {
  socket.emit("typing", username.value);
});

socket.on("typing", (data) => {
  actions.innerHTML = ` <p> <em> ${data} esta escribiendo...</em> </p> `;
});

//Nuevo usuario conectado
var toastMixin = Swal.mixin({
  toast: true,
  icon: "success",
  title: "General Title",
  animation: false,
  position: "top-right",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
socket.on("newUserConnected", (user) => {
  console.log("llego aca", user);
  if (isLogin) {
    Swal.fire({
      toast: true,
      icon: "success",
      title: `${user} se ha conectado`,
      animation: false,
      position: "top-right",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
  }
});
