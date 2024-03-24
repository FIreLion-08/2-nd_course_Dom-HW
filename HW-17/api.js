import { user } from "./index.js";
import { sanitizeHtml } from "./sanitizeHtml.js";
import _ from "lodash";

const commentsUrl = "https://webdev-hw-api.vercel.app/api/v2/Dmitry-Avdoshkin/comments";
const userUrL = "https://wedev-api.sky.pro/api/user/login";
const newUserUrl = "https://wedev-api.sky.pro/api/user";

export const setToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export async function getComments() {
  const response = await fetch(commentsUrl, {
    method: "GET",
    headers: {
      Authorization: setToken(),
    },
  });
  return await response.json();
}

export async function postComment(name, text) {
  const response = await fetch(commentsUrl, {
    method: "POST",
    headers: {
      Authorization: setToken(),
    },
    body: JSON.stringify({
      // name: name,
      text: sanitizeHtml(text),
    }),
  });
  return await response.json();
}

export async function deleteComment({ id }) {
  const response = await fetch(`${commentsUrl}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: setToken(),
    },
  });
  return await response.json();
}

export async function likeComment({ id }) {
  // console.log(likeComment);
  const response = await fetch(`${commentsUrl}/${id}/toggle-like`, {
    method: "POST",
    headers: {
      Authorization: setToken(),
    },
  });
  return await response.json();
}

export async function login({ login, password }) {
  const response = await fetch(userUrL, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  });
  if (response.status === 400) {
    throw new Error("Неверный запрос");
  }
  return await response.json();
}

export async function registration({ login, name, password }) {
  const response = await fetch(newUserUrl, {
    method: "POST",
    body: JSON.stringify({
      login,
      name: _.capitalize(name),
      password,
    }),
  });
  if (response.status === 400) {
    throw new Error("Неверный запрос");
  }
  return await response.json();
}
