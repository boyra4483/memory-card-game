import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { API_KEY, API_URL_USERS, API_URL_USERS_GAME_DATA, getData, sendData} from "./api.js";

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

button.addEventListener("click", register);

async function register() {
  form.onsubmit = () => false;

  const user = new User(form.nickname.value, form.email.value, form.password.value);

  // VALIDATION
  emailValidation(user.email);
  passwordValidation(user.password);
  await nameValidation(user);
  // END VALIDATION

  if (form.querySelector("[class~='error']") ) return;

  try {
    if (form.email.classList.contains("error")) {
      form.classList.remove("error");
      form.querySelector(".email-error").remove();
    }  

    const authUser = await createUserWithEmailAndPassword(auth, user.email, user.password);
    
    sendData(API_URL_USERS, {name: user.name})
    await updateProfile(auth.currentUser, {
      displayName: `${user.name}`
    })

    location.href = "http://127.0.0.1:5500/pages/user-profile.html";
    } catch (api_error) {
      form.email.classList.add("error");
      
      let error = document.createElement("div");
      error.classList.add("email-error");
      
      error.textContent = "the email has already been taken";
      form.email.after(error);
  }

}

async function nameValidation(user) {
  if (!isEnough(user.name.length)) {
    return createEnoungErr()
  } else {
    removeEnougErr()
  }

  if (!isFullSpace(user.name)) {
    return createSpaceErr()
  } else {
    removeSpaceErr()
  }

  if (await isNameTaken(user.name)) {
    return createTakenNameErr()
  } else {
    removeTakenErr()
  }

  function createTakenNameErr() {
    if (form.nickname.classList.contains("error")) return;

    form.nickname.classList.add("error")

    let error = document.createElement("div");
    error.classList.add("nickname-error");
    error.textContent = "the name have already been taken"
      
    form.nickname.after(error)
  }

  function removeTakenErr() {
    removeEnougErr()
  }

  function createEnoungErr() {
    if (form.nickname.classList.contains("error")) return;

    form.nickname.classList.add("error")

    let error = document.createElement("div");
    error.classList.add("nickname-error");
    error.textContent = "the field must have not less 4 symbols"
      
    form.nickname.after(error)
  }

  function removeEnougErr() {
    if (!form.querySelector(".nickname-error")) return;

    form.querySelector(".nickname-error").remove();
    form.nickname.classList.remove("error");
  }

  function createSpaceErr() {
    if (form.nickname.classList.contains("error")) return;

    form.nickname.classList.add("error")

    let error = document.createElement("div");
    error.classList.add("nickname-error");
    error.textContent = "the field must not have only the space symbols"
    
    form.nickname.after(error);
  }

  function removeSpaceErr() {
    removeEnougErr()
  }

  function isEnough(nameLength) {
    return (nameLength < 4) ? false : true
  } 

  function isFullSpace(name) {
    const isfullSpaceName = name.split("").find( char => (char.charCodeAt() == 32) ? false : true);
    return isfullSpaceName
  }

  async function isNameTaken(name) {
    try {
      const users = await getData(API_URL_USERS);

      const user = users.find(user => user.name.toLowerCase() == name.toLowerCase())
      
      return (user) ? true : false;
    } catch (error) {
      console.log(error)
    }
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
  if (password.length < 8) {
    if (form.password.classList.contains("error")) return;
    form.password.classList.add("error")
  
    let error = document.createElement("div");
    error.classList.add("password-error");
    error.textContent = "password must not be less than 8 symblos"
        
    form.password.after(error)
  } else {
    if (!form.querySelector(".password-error")) return;
  
    form.querySelector(".password-error").remove();
    form.password.classList.remove("error");
  }
}

function User(name, email, password) {
  this.name = name;
  this.email = email;
  this.password = password;
}