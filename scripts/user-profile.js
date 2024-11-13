"use strict"

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {API_URL_USERS, getData, updateData} from "./api.js"

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
let registerDate;


const header = document.querySelector(".header");
const user_profile_badge = header.querySelector(".header__user-profile");

const menu_pofile_badge = header.querySelector(".burger-menu__user-profile")
const userName = document.querySelector(".user-meta-data__user-name"); 

// const currentUser = await findCurrentUser(getData, API_URL_USERS);

const userForm = document.forms["user-form"];
const userIcon = userForm.querySelector(".user-data__img");

// COLORING OF BADGES
user_profile_badge.setAttribute("fill", "#007ACC");
menu_pofile_badge.setAttribute("fill", "#007ACC");

let currentUser;

// CHANGING OF USER'S PROFILE
onAuthStateChanged(auth, async user => {
  if (!user) return;
  
  userName.textContent = user.displayName;
  registerDate = new Date(+user.metadata.createdAt);
  
  const localeData = registerDate.toLocaleDateString().split(".");
  
  document.querySelector(".user-meta-data__user-date").textContent = `Joined ${registerDate.getDate()}, ${registerDate.toLocaleString("en-US", { month: 'long' })} ${registerDate.getFullYear()}`
  document.querySelector(".user-meta-data__user-date").setAttribute("datetime", `${localeData.at(-1)}-${localeData[1]}-${localeData[0]}`)
})