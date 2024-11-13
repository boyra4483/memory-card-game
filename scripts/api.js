"use strict"

const API_KEY = "66d585b8f5859a7042666536";

const API_URL_USERS = `https://${API_KEY}.mockapi.io/api/memory-card-game/users`;
const API_URL_USERS_GAME_DATA = `https://${API_KEY}.mockapi.io/api/memory-card-game/user-game-data`;

async function sendData(url, user) {
  const response = await fetch(url, {
    method: "POST",
    headers: {"content-type": "application/json"},
    body: JSON.stringify(user)
  })
}

async function getData(url) {
  let response = await fetch(url, {
    method: "GET",
    headers: {"content-type": "application/json"},
  })
  return await response.json()
}

async function updateData(url, data) {
  const response = await fetch(url, {
    method: "PUT",
    headers: {"content-type": "application/json"},
    body: JSON.stringify(data)
  })
}

export {API_KEY, API_URL_USERS, API_URL_USERS_GAME_DATA, getData, sendData, updateData};