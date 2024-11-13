"use strict"

import { API_URL_USERS, API_URL_USERS_GAME_DATA, getData, sendData, updateData } from "./api.js";
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
const users = await getData(API_URL_USERS);

let currentUser;

onAuthStateChanged(auth, async user => {
  currentUser = users.find( userFromDb => userFromDb.name == user.displayName);
  const userGameHistory = await getData(`${API_URL_USERS}/${currentUser.id}/user-game-data`);

  if(userGameHistory.length == 0 || userGameHistory == "Not found") {
    await sendData(`${API_URL_USERS}/${currentUser.id}/user-game-data`, {
      pts: [],
      guessedCard: [],
    })
  }
})

let cardOne, cardTwo, intervalId, guessedCards = 0; 
const header = document.querySelector(".header");

const crown_badge = header.querySelector(".header__crown-badge");
const home_badge = header.querySelector(".burger-menu__home-badge");

const game_container = document.querySelector(".game-container");
const cards_container = document.querySelector(".game-cards"); 

const cards = document.querySelectorAll(".game-cards__card"); 
const restart = document.querySelector(".game-param__restart");

const game_form = document.forms["game-form"];
const game_timer = game_form.timer;

const close_btn = document.querySelector(".result__close-btn");
const result = document.querySelector(".result");

const result_title = result.querySelector(".result__title");
const result_speed = result.querySelector(".result__pts > span");

const result_quessed_card = result.querySelector(".result__guessed-card");
const loader = document.querySelector(".user-name__loader")

const game_param = document.querySelector(".game-param")

// COLORING OF BADGES
home_badge.setAttribute("fill", "#007ACC")

// THE LOGIC OF GAME
game_container.addEventListener("click", hanlder);
restart.addEventListener("click", restarting);

close_btn.addEventListener("click", close)
game_timer.addEventListener("change", changeTime)

async function timer() {
  let time = +game_timer.value;
  
  let selectedTime = game_timer.options[game_timer.selectedIndex];
  result_speed.textContent = `${game_timer.value}`;
  
  intervalId = setInterval( () => {
    if( !+time.toFixed(2) ) {
      selectedTime.value = 0.00.toFixed(2);
      selectedTime.textContent = selectedTime.value
      
      
      game_timer.removeAttribute("disabled");
      game_container.removeEventListener("click", hanlder);
      
      result.style.display = "block";
      document.querySelector("body").dataset.blur = "active";

      // ADDING OF INFO IN MODAL BLOCK
      result_title.textContent = "result";
      result_quessed_card.querySelector("span").textContent = `${guessedCards}`;

      ;(async () => {
        const userGameHistory = await getData(`${API_URL_USERS}/${currentUser.id}/user-game-data`)

        updateData(`${API_URL_USERS}/${currentUser.id}/user-game-data/${currentUser.id}`, {
          pts: [...userGameHistory[0].pts, result_speed.textContent],
          guessedCard: [...userGameHistory[0].guessedCard, guessedCards]
        })
      })()

      return clearInterval(intervalId)
    };

    time -= 0.01;
    selectedTime.value = time.toFixed(2);

    selectedTime.textContent = selectedTime.value
  }, 10);
}

async function restarting() {
  game_timer.removeAttribute("disabled");
  
  cards.forEach( elem => {
    elem.dataset.guessed = "not";
    elem.classList.remove("active");
  });

  cardOne = null;
  cardTwo = null;
  
  clearInterval(intervalId);
  intervalId = null;
  
  Array.from(game_timer.options).forEach( (elem, index, arr) => {
    if( !index ) {
      elem.value = 30.00.toFixed(2)
      elem.textContent = elem.value
      return
    } 

    elem.value = `${ (arr[--index].value - 5).toFixed(2) }`;
    elem.textContent = elem.value;
  })

  mixing()
  game_container.addEventListener("click", hanlder)
  
  // getData(`${API_URL_USERS}/${currentUser.id}/user-game-data`)
}

function mixing() {
  restart.addEventListener("pointerdown", event => event.preventDefault())
  for (let i = 0; i < cards.length; i++) {
    let randomElem = Math.floor( Math.random() * 20 );
    cards_container.append(cards[randomElem])
  }
}

function win() {
  return !(Array.from(cards).find( elem => {
    if( elem.dataset.guessed == "not" ) return true;
  }))
}

function hanlder(event) {
  game_container.addEventListener("dragstart", event => event.preventDefault())

  if ( !event.target.closest(".game-cards__card") ) return;
  if( !game_timer.hasAttribute("disabled") ) game_timer.setAttribute("disabled","disabled");
 
  if( !intervalId ) timer();
  if( event.target.dataset.guessed == "yes" ) return;

  let target = event.target;
  
  if( !cardOne ) {
    cardOne = target;
    cardOne.classList.add("active")
  } else {
    cardTwo = target;
    cardTwo.classList.add("active")
  }
  
  
  // IF SOME CARD IS UNDEFINED WE EXIT FROM FUNCTION
  if( !(cardOne && cardTwo) ) return;
  if ( isSameCard(cardOne, cardTwo) ) {
    cardTwo = null

    return;
  };


  if( guess(cardOne, cardTwo) ) {
    guessedCard(cardOne, cardTwo);
    
    guessedCards += 2;
    
    if( win() ) {
      // ADDING OF INFO IN MODAL BLOCK
      result_title.textContent = "you won!!!";
      result_speed.textContent = `${game_timer.value}`;

      result_quessed_card.textContent = "you guessed: all cards";
      game_timer.removeAttribute("disabled");
      
      result.style.display = "block";
      document.querySelector("body").dataset.blur = "active";
      
      clearInterval(intervalId);
      game_container.removeEventListener("click", hanlder);

      ;(async () => {
        const userGameHistory = await getData(`${API_URL_USERS}/${currentUser.id}/user-game-data`)
    
        updateData(`${API_URL_USERS}/${currentUser.id}/user-game-data/${currentUser.id}`, {
          pts: [...userGameHistory[0].pts, game_timer.value],
          guessedCard: [...userGameHistory[0].guessedCard, guessedCards]
        })
      })()

    }
    
    cardOne = null;
    return cardTwo = null;
  }
  
  game_container.removeEventListener("click", hanlder)
  
  setTimeout(() => {
    cardOne.classList.remove("active");
    cardTwo.classList.remove("active");
    cardOne = null;
    cardTwo = null;
    game_container.addEventListener("click", hanlder)
  }, 310);
}

function isSameCard(card, cardTwo ) {
 return ( card.getAttribute("id") == cardTwo.getAttribute("id") ) ? true : false
}

function guessedCard(card, cardTwo) {
  card.dataset.guessed = "yes";
  cardTwo.dataset.guessed = "yes";
}

function guess(card, cardTwo) {
  return ( card.dataset.name == cardTwo.dataset.name ) ? true : false
}

function close(event) {
  event.target.parentElement.style.display = "none";
  document.querySelector("body").dataset.blur = "inactive";
}

async function changeTime() {
  Array.from(game_timer.options).forEach( (elem, index, arr) => {
    if( !index ) {
      elem.value = 30.00.toFixed(2)
      elem.textContent = elem.value
      return
    } 

    elem.value = `${ (arr[--index].value - 5).toFixed(2) }`;
    elem.textContent = elem.value;
  })  

  // getData(`${API_URL_USERS}/${currentUser.id}/user-game-data`)
}

mixing()