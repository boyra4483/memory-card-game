"use strict"

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCmcva2PT5-OzuKwnmN2A1w7yzYY_KImS8",
  authDomain: "memory-card-game-35d32.firebaseapp.com",
  projectId: "memory-card-game-35d32",
  storageBucket: "memory-card-game-35d32.appspot.com",
  messagingSenderId: "283766140449",
  appId: "1:283766140449:web:d5410bac2e3637cfa63d60"
};
const app = initializeApp(firebaseConfig)

const auth = getAuth(app);

const menuBurger = document.querySelector(".burger");
const logout = document.querySelector(".header__logout");

menuBurger.addEventListener("click", activeBurger)
logout.addEventListener("click", logoutUser);

function activeBurger(event) {
  if(!event.target.closest(".burger__lines")) return;
  menuBurger.classList.toggle("active")
}

async function logoutUser() {
  try {
    await signOut(auth)
    location.href = "http://127.0.0.1:5500/pages/index.html";
  } catch (error) {
    console.log(error)
  }
}