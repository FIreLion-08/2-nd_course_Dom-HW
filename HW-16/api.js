import { user } from "./index.js";
const commentsUrl = "https://webdev-hw-api.vercel.app/api/v2/Dmitry-Avdoshkin/comments";
const userUrL =     "https://wedev-api.sky.pro/api/user/login";
const newUserUrl =  "https://wedev-api.sky.pro/api/user"

export const setToken = () => {
    const token = user ? `Bearer ${user.token}` : undefined;
    return token;
  };

export function getComments({ token}) {
    return fetch(commentsUrl, {
        method: "GET",
        headers: {
            Authorization: token,
        }
    }).then((response) => {
       return response.json()
    });
};

export function postComment(name, text) {
    return fetch(commentsUrl, {
        method: "POST",
        headers: {
            Authorization: setToken(),
        },
        body: JSON.stringify({
            name: name,
            text: text,
            // forceError: true,
        })
    }).then((response) => {
        return response.json()
    });
};

export function deleteComment({id}) {
    return fetch(`${commentsUrl}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: setToken(),
        }
    }).then((response) => {
       return response.json()
    });
};

export function likeComment({ id }) {
    console.log(likeComment);
    return fetch(`${commentsUrl}/${id}/toggle-like`, {
        method: "POST",
        headers: {
            Authorization: setToken(),
        }
    }).then((response) => {
       return response.json()
    });
};

export function login({login, password }) {
    return fetch(userUrL, {
        method: "POST",
        body: JSON.stringify({
           login,
           password,
            forceError: true,
        })
    })
        .then((response) => {
        if (response.status === 400) {
          throw new Error("Неверный логин или пароль");
        }
        return response.json();
      });

};

export function registration({login, name, password }) {
    return fetch(newUserUrl, {
        method: "POST",
        body: JSON.stringify({
            login,
            name,
            password,
            // forceError: true,
        })
    }).then((response) => {
        if (response.status === 400) {
          throw new Error("Такой пользователь уже существует");
        }
        return response.json();
      });
};
