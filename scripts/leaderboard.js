"use strict"

import {API_KEY, API_URL_USERS, API_URL_USERS_GAME_DATA, getData, sendData, updateData} from "./api.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

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

const list_items = document.querySelectorAll(".user-data")
const header = document.querySelector(".header");

const board_badge = header.querySelector(".header__crown-badge")
const menu_board_badge = header.querySelector(".burger-menu__crow-badge")

board_badge.setAttribute("fill", "#007ACC")
menu_board_badge.setAttribute("fill", "#007ACC")

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, async user => {
    const users = await getData(API_URL_USERS);
    const users_game_history = await getData(API_URL_USERS_GAME_DATA);
    
    const users_data = users.reduce( (data, user) => {
      const user_id = user.id;
      const user_game_history = users_game_history.find( history => {
        return user.id == history.userId;
      })

      return [...data, [user, user_game_history]]
    }, [])

    for (let i = 0; i < users_data.length; i++) {
      const user_data = users_data[i];
      const user_pts = user_data[1].pts;
      
      if (!i) {
        if (document.querySelectorAll(".user-data").length < user_pts.length) {
          for (let i = document.querySelectorAll(".user-data").length; i < user_pts.length; i++) {
            document.querySelector(".users-list").append(list_items[1].cloneNode(true))
          }
        } else {
          while (true) {
            if (document.querySelectorAll(".user-data").length == user_pts.length) break
            document.querySelectorAll(".user-data")[document.querySelectorAll(".user-data").length - 1].remove()
          }
        }
      } else {
        const list_items = document.querySelectorAll(".user-data");
        while (true) {
          if ((list_items.length + user_pts.length) == document.querySelectorAll(".user-data").length) break
          console.log(document.querySelectorAll(".user-data").length + user_pts.length)
          document.querySelector(".users-list").append(list_items[1].cloneNode(true));
        }
      }

      for (let j = 0; j < user_pts.length; j++) {
        const list_items = document.querySelectorAll(".user-data") 

        const list_item = list_items[j];
        list_item.querySelector(".user-data__name").textContent = user_data[0].name;

        list_item.querySelector(".user-data__speed").textContent = user_data[1].pts[j]
        list_item.querySelector(".user-data__guessed-cards").textContent = user_data[1].guessedCard[j]

        if (!j) continue;
        list_item.querySelector(".user-data__position").textContent = `${j + 1}`;
        // доделать некорректность
      }
        
    }
  })

})