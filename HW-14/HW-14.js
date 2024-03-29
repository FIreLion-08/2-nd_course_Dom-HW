
const buttonElement = document.getElementById("add-button");
const nameInputElement = document.getElementById("name-input");
const commentInputElement = document.getElementById("comment-input");
const likeInputElement = document.getElementById("like-input");
const commentsElement = document.getElementById("comments");
const addForm = document.getElementById("add-form");
const container = document.getElementById("add-container");
const loaderElement = document.getElementById("loading");

// Установка формата даты ДД.ММ.ГГГГ ЧЧ:ММ
const formatDateTime = () => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth()).padStart(2, '0');
    const year = String(currentDate.getFullYear() - 2000);
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
};

//Массив
let comments = [];

// Запрос данных в API на комментарий
buttonElement.disabled = true;
loaderElement.innerHTML = "Подождите пожалуйста, комментарии загружаются...";
const fetchAndRenderComments = () => {
    fetch("https://webdev-hw-api.vercel.app/api/v1/Dmitry-Avdoshkin/comments", {
        method: "GET"
    }).then((response) => {
        response.json().then((responseData) => {
            const appComments = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    date: formatDateTime(comment.date),
                    text: comment.text,
                    likes: comment.likes,
                    isLiked: false,
                };
            });
            comments = appComments;
            renderComments();
        }).then((response) => {
            buttonElement.disabled = false;
            loaderElement.textContent = "";
        });
    });
};
fetchAndRenderComments();

function delay(interval = 300) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, interval);
    });
};

//Рендер функция - Добавление комментариев
const renderComments = () => {
    const commentsHtml = comments
        .map((comment, index) => {
            return `<li class="comment" data-index="${index}" id="comment">
                <div class="comment-header" >
                    <div class="comment-name">${comment.name}</div>
                    <div>${comment.date}</div>
                </div>
                <div class="comment-body">
                    <div class="comment-text">${comment.text}</div>
                </div>
                <div class="comment-footer">
                    <button id=delete-form-button class="delete-form-button" data-index="${index}">Удалить</button>
                    <div class="likes">
                        <span class="likes-counter">${comment.likes}</span>
                        <button class="${comment.isLike ? 'like-button active-like': 'like-button'} " data-index="${index}"></button>
                    </div>
                </div>
             </li>`;
        }).join("");

    commentsElement.innerHTML = commentsHtml;

    // кнопка Цитирования
    const commentElements = document.querySelectorAll(".comment");
    for (const comment of commentElements) {
        comment.addEventListener("click", () => {
        const index = comment.dataset.index;
            const comentText = comments[index].text;
            const comentAuthor = comments[index].name;
            commentInputElement.value = `>${comentAuthor} ${comentText} `;
        })
    };
    initLikesListeners();
    initDeleteButtonsLisners();
};
//Кнопка лайков
const initLikesListeners = () => {
    for (const commentElement of document.querySelectorAll(".like-button")) {
        // Добавляет обработчик клика на конкретный элемент в списке
        commentElement.addEventListener("click", (event) => {
            event.stopPropagation();
            const index = commentElement.dataset.index;
            comments[index].likes += comments[index].isLike ? -1 : +1;
            comments[index].isLike = !comments[index].isLike;
            renderComments();
        });
    };

};
//Кнопка удаления
const initDeleteButtonsLisners = () => {
    const deleteButtonsElements = document.querySelectorAll(".delete-form-button");
    for (const deleteButtonsElement of deleteButtonsElements) {
        deleteButtonsElement.addEventListener("click", (event) => {
            event.stopPropagation();
            const index = deleteButtonsElement.dataset.index;
            comments.splice(index, 1);
            renderComments();
        });
    };
};
renderComments();

//Форма добавления комментариев
buttonElement.addEventListener("click", () => {
    nameInputElement.style.backgroundColor = "white" ;
    commentInputElement.style.backgroundColor = "white";
    if (nameInputElement.value === "") {
      nameInputElement.style.backgroundColor = "red";
      return;
    }
    if (commentInputElement.value === "") {
      commentInputElement.style.backgroundColor = "red";
      return;
    }
    buttonElement.disabled = true;
    buttonElement.textContent = "Комментарий добавляется...";

    const handlePostClick = () => {
        fetch("https://webdev-hw-api.vercel.app/api/v1/Dmitry-Avdoshkin/comments", {
            method: "POST",
            body: JSON.stringify({
                name: nameInputElement.value,
                text: commentInputElement.value,
                forceError: true,
            })
        })
        .then((response) => {
            console.log(response);
            if (response.status === 201) {
               return response.json();
            }
            if (response.status === 400) {
                throw new Error("Неверный запрос");
            }
            if (response.status === 500) {
              throw new Error("Сервер упал");
            }

          })
        .then((responseData) => {
            return fetchAndRenderComments();
        })
        .then(() => {
            buttonElement.disabled = false;
            buttonElement.textContent = "Написать";
            nameInputElement.value = "";
            commentInputElement.value = "";
        })
        .catch((error) => {
            buttonElement.disabled = false;
            buttonElement.textContent = "Написать";
            if (error.message === "Неверный запрос") {
                alert("Имя и комментарий должны быть не короче 3 символов");
            } if (error.message === "Сервер упал") {
              //  Пробуем снова, если сервер сломался
                alert("Кажется, что-то пошло не так, попробуй позже");
                delay(1000).then(() => {
                  handlePostClick();
                });
            } if (error.message === 'Failed to fetch') {
                alert("Кажется,сломался интернет, попробуй позже");
            }
            // TODO: Отправлять в систему сбора ошибок
            console.warn(error);
        });
    };
    handlePostClick();
    // renderComments();
    // initDeleteButtonsLisners();
});
