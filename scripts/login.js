"use strict"
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js"

const firebaseConfig = {
  apiKey: "AIzaSyCmcva2PT5-OzuKwnmN2A1w7yzYY_KImS8",
  authDomain: "memory-card-game-35d32.firebaseapp.com",
  projectId: "memory-card-game-35d32",
  storageBucket: "memory-card-game-35d32.appspot.com",
  messagingSenderId: "283766140449",
  appId: "1:283766140449:web:d5410bac2e3637cfa63d60"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const form = document.forms.authorization;


const button = form.querySelector(".authorization__button") 
const forgetBtn = form.querySelector(".auxiliary-links__forget-password");

const fingerprintImg = form.querySelector(".authorization__wrapper > svg");
const authorizationBtn = form.querySelector(".authorization__button");

button.addEventListener("click", login);
// forgetBtn.addEventListener("click", resetPassword)

// async function resetPassword(event) {
//   if (form.querySelector(".authorization > *[class$=\"error\"]")) {
//     const errors = form.querySelectorAll(".authorization > *[class$=\"error\"]");

//     errors.forEach(error => {
//       error.classList.remove("error");
//       if (error.className.includes("error")) error.remove()
//     })
//   } 

//   if (ressetingStatus) ressetingStatus.remove();
//   (forgetBtn.textContent == "Forget Password ?") ? forgetBtn.textContent = "sign in" : forgetBtn.textContent = "Forget Password ?";

//   form.password.hidden = !form.password.hidden;
//   (fingerprintImg.style.display == "none") ? fingerprintImg.style.display = "block" : fingerprintImg.style.display = "none";

//   (authorizationBtn.textContent == "sign in") ? authorizationBtn.textContent = "Resseting" : authorizationBtn.textContent = "sign in";
//   (title.textContent == "Login") ? title.textContent = "Resseting" : title.textContent = "Login";
// }

async function login() {
  form.onsubmit = () => false;
  const user = new User(form.email.value, form.password.value);

  emailValidation(user.email);
  passwordValidation(user.password)
  
  if (form.querySelector("[class~='error']") ) return;

  try {
    if (form.querySelector(".error")) form.querySelector(".error").remove();

    const response = await signInWithEmailAndPassword(auth, user.email, user.password);

    location.href = "http://127.0.0.1:5500/pages/user-profile.html";
  } catch (api_error) {
    let error = document.createElement("div");
    error.classList.add("firebase-error")
    error.textContent = "the wrong email or/and password" 

    form.password.after(error)
  }
}

function emailValidation(email) {
  const partOfEmail = email.slice(email.indexOf("@"));

  isCorrectLast(email, partOfEmail)
  isCorrectStart(email, partOfEmail)

  function isCorrectLast(email, partOfEmail) {
    if (!email.includes("@") || !partOfEmail.includes(".") || (partOfEmail.slice(-1) == ".")) {
      if (form.email.classList.contains("error")) return;
      form.email.classList.add("error")
    
      let error = document.createElement("div");
      error.classList.add("email-error");
      error.textContent = "it is not correct email"
          
      form.email.after(error)
    } else {
      if (!form.querySelector(".email-error")) return;
  
      form.querySelector(".email-error").remove();
      form.email.classList.remove("error");
    }
  }

  function isCorrectStart(email, partOfEmail) {
    if (email.slice(0, email.indexOf(partOfEmail)).includes(" ")) {
      if (form.email.classList.contains("error")) return;
      form.email.classList.add("error");
    
      let error = document.createElement("div");
      error.classList.add("email-error");
      error.textContent = `before ${partOfEmail} must not have the space symbol`;
          
      form.email.after(error);
    }
  }
}

function passwordValidation(password) {
  if (!password.length) {
    if (form.password.classList.contains("error")) return;
    form.password.classList.add("error")
  
    let error = document.createElement("div");
    error.classList.add("password-error");
    error.textContent = "the password is empty"
        
    form.password.after(error)
  } else {
    if (!form.querySelector(".password-error")) return;
  
    form.querySelector(".password-error").remove();
    form.password.classList.remove("error");
  }
}

function User(email, password) {
  this.email = email;
  this.password = password;
}