//use strict";
import { getComments } from "./api.js";
import { renderComments } from "./render.js";
import { setToken } from "./api.js";
import { format } from "date-fns";
import {
  // getFromLocalStorage,
  saveToLocalStorage,
  removeFromLocalStorage,
} from "./helpers.js";
let comments = [];

// Форматируем дату из библиотеки date-fns
const now = new Date();
const createDate =
  // format(now, "dd/MM/yyyy hh:mm"); // 20/03/2024 10:33
  // format(now, "MM-dd-yyyy hh:mm"); // 21-26-2024 10:33
  // format(now, "dd.MM.yyyy hh:mm:ss"); // 21.03.2024 10:33:41
  format(now, "yyyy-MM-dd hh.mm.ss"); // 2024-03-24 10.33.41

// export let user = getFromLocalStorage();
export let user = null;
export const setUser = (newUser) => {
  user = newUser;
  saveToLocalStorage(user);
};

export const logout = () => {
  user = null;
  removeFromLocalStorage();
};
// Запрос двнных в API на комментарий
export const fetchAndRenderComments = (comments) => {
  getComments({ token: setToken() }).then((res)=> {
    if(!res.ok){
      throw new Error('Ошибк запроса')
    }
    return res.json()
  })
    .then((responseData) => {
    const appComments = responseData.comments.map((comment) => {
      return {
        id: comment.id,
        name: comment.author.name,
        date: createDate,
        text: comment.text,
        likes: comment.likes,
        isLiked: comment.isLiked,
      };
    });
    comments = appComments;
    renderComments(comments);
  })
  //Падения интернета
  .catch((error)=> {
    alert(error.message)
    const appHTML=document.getElementById('app')
    appHTML.innerHTML='Ошибка с интернетом'
    renderComments(comments);
  })
};
fetchAndRenderComments(comments);
