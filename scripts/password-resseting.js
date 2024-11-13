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
const resetBtn = document.querySelector(".authorization__button");

const ressetingStatus = document.createElement("p");

ressetingStatus.classList.add("authorization__ressetingStatus");
ressetingStatus.textContent = "The verification email is sent";

resetBtn.addEventListener("click", resetPassword)

async function resetPassword() {
  document.forms.authorization.onsubmit = () => false
  const email = document.forms.authorization.email.value;

  await sendPasswordResetEmail(auth, email);
  return document.forms.authorization.email.after(ressetingStatus);
}