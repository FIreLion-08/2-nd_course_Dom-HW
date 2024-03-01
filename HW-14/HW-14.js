const buttonElement = document.getElementById("add-button");
const listElement = document.getElementById("list");
const nameInputElement = document.getElementById("name-input");
const commentInputElement = document.getElementById("comment-input");
const deleteButtonElement = document.getElementById("delete-button");
const addSignElement = document.getElementById("add-sign");

// Установка формата даты ДД.ММ.ГГГГ ЧЧ:ММ
let currentDate = new Date();
let day = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate();
let month = currentDate.getMonth() < 10 ? '0' + currentDate.getMonth() : currentDate.getMonth();
let year = currentDate.getFullYear().toString().slice(-2);
let hours = currentDate.getHours() < 10 ? '0' + currentDate.getHours() : currentDate.getHours();
let minutes = currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes();
let formattedDate = `${day}.${month}.${year} ${hours}:${minutes}`;


//HW-13 - Лоадер загрузки приложения
window.addEventListener('load', function () {
  const addSign = document.getElementById('add-sign');
  const list = document.getElementById('list');
  addSign.innerHTML = "Пожалуйста, подождите, загружаются комментарии...";

  list.value = "";
  list.style.display = "none";
  return delayForSecond()
  .then(() => {
	  addSign.style.display = "none";
	  list.style.display = "flex";
	});
});
function delayForSecond(){
	delay(3000);
	return delay();
}
function delay(interval = 2000) {
	return new Promise((resolve) => {
	  setTimeout(() => {
		resolve();
	  }, interval);
	});
}

// Массив
let comments = [];


const fetchAndRenderComments = () => {
//HW_02.12
// Берем данные из массива с помощью GET и загружаем на сервер
  fetch("https://webdev-hw-api.vercel.app/api/v1/Dmitry-Avdoshkin/comments", {
	  method: 'GET',
  })
  .then(response => response.json())
  .then(responseData => {
    const appComments = responseData.comments.map((comment) => {
      return {
	      name: comment.author.name,
	      date: new Date(comment.date).toLocaleTimeString('sm', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }),
	      comment: comment.text,
	      like: comment.likes,
	      userLike: false,
	      isEdit: false
	    };
    });
	  comments = appComments;
	  renderComments();
	});
}



function addTodo() {
	const startAt = Date.now();
	console.log("Start doing require");
	fetch("https://webdev-hw-api.vercel.app/api/v1/Dmitry-Avdoshkin/comments", {
    method: "POST",
    body: JSON.stringify({
      name: nameInputElement.value.replaceAll("<", "&lt").replaceAll(">", "&gt").replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll(" ", "&nbsp;"),
      text: commentInputElement.value.replaceAll("<", "&lt").replaceAll(">", "&gt").replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll(" ", "&nbsp;"),
	  }),
  })
	.then((response) => {
		console.log("Time: " + (Date.now() - startAt));
		return response;
	})
	.then((response) => {
		return response.json();
	})
	.then((response) => {
		console.log("Time: " + (Date.now() - startAt));
		return response;
  })
	.then(() => {
		fetchAndRenderComments();
		buttonElement.disabled = false;
		buttonElement.textContent = "Написать";
	});
	nameInputElement.value = "";
	commentInputElement.value = "";
	nameInputElement.disabled = false;
	commentInputElement.disabled = false;
	buttonElement.disabled = false;
	nameInputElement.focus();
}


// Условие не активной кнопки
buttonElement.disabled = true;
nameInputElement.addEventListener('input', () => {
  if (nameInputElement.value === "" || commentInputElement.value === "") {
    buttonElement.disabled = true;
    return;
  } else {
    buttonElement.disabled = false;
  }
});


// Проверка на пустые поля
commentInputElement.addEventListener('input', () => {
  if (nameInputElement.value === "" || commentInputElement.value === "") {
    buttonElement.disabled = true;
    return;
  } else {
    buttonElement.disabled = false;
  }
});
nameInputElement.addEventListener('input', function() {
  nameInputElement.classList.remove("error");
});
commentInputElement.addEventListener('input', function() {
  commentInputElement.classList.remove("error");
});

//HW-13 - Лоадер загрузки при добалении коментария
// Условия для "Комментарий добавляется..."
buttonElement.addEventListener("click", () => {
  nameInputElement.classList.remove("error");
  commentInputElement.classList.remove("error");
  nameInputElement.classList.remove("error");
  commentInputElement.classList.remove("error");

  if (nameInputElement.value.trim() === "") {
    nameInputElement.classList.add("error");
    return;
  }

  if (commentInputElement.value.trim() === "") {
    commentInputElement.classList.add("error");
    return;
  }

  if (nameInputElement.value.trim() === "") {
    nameInputElement.classList.add("error");
    return;
  }

  if (commentInputElement.value.trim() === "") {
    commentInputElement.classList.add("error");
    return;
  }

  if (nameInputElement.value === "") {
    nameInputElement.classList.add("error");
    return;
  }
   if (commentInputElement.value === "") {
    commentInputElement.classList.add("error");
    return;
  }
	buttonElement.disabled = true;
	buttonElement.textContent = "Комментарий добавляется...";
	addTodo()
});
fetchAndRenderComments();


// Добавление и удаление Лайков
const likes = () => {
  function delay2(interval = 100) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, interval);
    });
  }
  const likeButtons = document.querySelectorAll(".like-button");
  for (const likeButton of likeButtons) {
    likeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = likeButton.dataset.index;
      const comment = comments[index];
      delay2(2000).then(() => {
        // Вариант_№1
        comment.likes = comment.isLiked ? comment.likes -- : comment.likes ++;
        comment.isLiked = !comment.isLiked;
        comment.isLikeLoading = false;
        renderComments();
      });
      if (!comment.userLike) {
        comment.like += 1;
        comment.userLike = true;
      } else {
        comment.filling = "";
        comment.like -= 1;
        comment.userLike = false;
      }
    });
  }
};


//Редактирование комментариев
const handleEdit = (index) => {
	const handleEditElements = document.querySelectorAll(".editing");
	for ( const handleEditElement of handleEditElements) {
		handleEditElement.addEventListener("click" , (event) => {
		event.stopPropagation();
  comments[index].isEdit = true;
  renderComments();
  // Показываем кнопку "Сохранить"
  listElement.querySelectorAll('.comment')[index].querySelector('.save-button').style.display = "block";
  renderComments();
	});
  }
};

function isCommentEmpty(comment) {
  const isEmpty = comment.trim() === "";
  if (isEmpty) {
    // Если комментарий пуст, добавляем класс "error" к соответствующему элементу формы
    commentInputElement.classList.add("error");
  } else {
    // Если комментарий не пуст, удаляем класс "error"
    commentInputElement.classList.remove("error");
  }
  return isEmpty;
}


// Cохранаяем отредактированный комментарий
const handleSave = () => {
	const handleSaveElements = document.querySelectorAll(".saving");
	for ( const handleSaveElement of handleSaveElements) {
		handleSaveElement.addEventListener("click" , (event) => {
			event.stopPropagation();
      // Получаем отредактированный комментарий
			const index = handleSaveElement.dataset.index;
      const comment = comments[index];
      // Получаем отредактированный комментарий
	    const editedComment = listElement.querySelectorAll('.comment')[handleSaveElement.dataset.index].querySelector('.comment-input').value;
	    if (isCommentEmpty(editedComment)) {
		  // Обработка ошибки или уведомление пользователю о невозможности отправить пустой комментарий
        return;
      }
	    comments[index].comment = editedComment; // Обновляем комментарий в массиве
      comments[index].isEdit = false; // Устанавливаем флаг редактирования в false

      // Скрываем кнопку "Сохранить" после сохранения
      listElement.querySelectorAll('.comment')[index].querySelector('.save-buttons').style.display = "none";
	    renderComments(); // Перерисовываем комментарии
    });
  }
};

// Добавление комментариев
const renderComments = () => {
  const commentsHtml = comments.map((comment, index) => comment.isEdit ?
  `<li class="comment" data-index="${index}">
    <div class="comment-header">
      <div>${comment.name}</div>
      <div>${comment.date}</div>
    </div>
    <div="comment-body">
      <div class="comment-text">
        <textarea data-index="${index}" class="comment-input add-text" rows="4">${comment.comment}</textarea>
        <button type="submit" data-index='${index}' class="save-buttons add-form-button2 saving post-button">Сохранить</button>
      </div>
    </div>
  </li>`
  :
  `<li class="comment">
    <div class="comment-header">
      <div class="comment-name">${comment.name}</div>
      <div>${comment.date}</div>
    </div>
    <div class="comment-body">
      <div class="comment-text" data-index="${index}">
        <span data-index='${index}' class="comment-content">${comment.comment}</span>
        <button class="edit-button add-form-button2">Редактировать</button>
      </div>
    </div>
    <div class="comment-footer">
      <div class="likes">
        <span class="likes-counter">${comment.like}</span>
        <button data-index='${index}' class="like-button ${comment.userLike ? "-active-like" : ""}"></button>
      </div>
    </div>
  </li>`
  ).join("");
  listElement.innerHTML = commentsHtml;

  likes();
	handleEdit();
	handleSave();

  const editButtons = document.querySelectorAll(".edit-button");
  editButtons.forEach((button, index) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
          comments[index].isEdit = true;
          renderComments();
    });
  });

  // Ответ на комментарий
	const commentElements = document.querySelectorAll(".comment");
  commentElements.forEach((comment) => {
    comment.addEventListener('click', (event) => {
      // Получаем имя автора и текст комментария
      const author = event.currentTarget.querySelector('.comment-header .comment-name').textContent;
      const text = event.currentTarget.querySelector('.comment-text .comment-content').textContent;
      // Формируем ответную цитату для вставки в поле комментария
      const quotedText = `> ${text}\n\n @${author}, `;
      document.getElementById('comment-input').value = quotedText;
	    renderComments();
    });
  });

  //Кнопка сохранения после редактирования
  const saveButtons = document.querySelectorAll(".save-button");
    saveButtons.forEach((button, index) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const editedComment = button.parentNode.nextElementSibling.children[0].children[0].value;
        comments[index].comment = editedComment;
        comments[index].isEdit = false;
			  renderComments();
      });
    });
};
renderComments();

// Удаление комментариев
deleteButtonElement.addEventListener("click", () => {
  const comments = Array.from(listElement.querySelectorAll(".comment"));
  if (comments.length > 0) {
    listElement.removeChild(comments[comments.length - 1]);
    comments.pop(); // Удаляем последний комментарий из массива
  }
});

nameInputElement.value = "";
commentInputElement.value = "";
nameInputElement.value.trim() === "" || commentInputElement.value.trim() === "";
renderComments();

// Нажатие для ввода ЕNTER
document.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    buttonElement.click();
  }
});
