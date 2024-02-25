const nameInputElement = document.getElementById('name-input');
const commentInputElement = document.getElementById('comment-input');
const buttonElement = document.getElementById('add-button');
const listElement = document.getElementById('list');
const deletebuttonElement = document.getElementById('delete-button');

// Установка формата даты ДД.ММ.ГГГГ ЧЧ:ММ
const date = new Date();
const formattedDate =
  date.getDate().toString().padStart(2, '0') + '.' +
  (date.getMonth() + 1).toString().padStart(2, '0') + '.' +
  date.getFullYear().toString().slice(-2) + ' ' +
  date.getHours().toString().padStart(2, '0') + ':' +
  date.getMinutes().toString().padStart(2, '0');

//Функция безопастности ввода данных
  function replaceText(text) {
    return text.replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
  }

// Массив
let commentsArray = [
  // РЕНДЕРИТСЯ ИЗ API
  // {
  //   name: 'Глеб Фокин',
  //   date: '12.02.22 12:18',
  //   comment: 'Это будет первый комментарий на этой странице',
  //   like: 3,
  //   user_Like: false,
  //   paint: ''
  // },
  // {
  //   name: 'Варвара Н.',
  //   date: '13.02.22 19:22',
  //   comment: 'Мне нравится как оформлена эта страница! ❤',
  //   like: 75,
  //   user_Like: false,
  //   paint: ''
  // }
];

//HW_02.12
// Берем данные из массива с помощью GET и загружаем на сервер
const fetchPromise = fetch("https://webdev-hw-api.vercel.app/api/v1/Dmitry-Avdoshkin/comments", {
  method: "GET"
});
// подписываемся на успешное завершение запроса с помощью then
fetchPromise.then((response) => {
  // Запускаем преобразовываем "сырые" данные от API в json формат
  const jsonPromise = response;
  // Подписываемся на результат преобразования
  jsonPromise.json().then((responseData) => {
    // приведение к нужному формату данных
    const formatComments = responseData.comments.map ((comment) => {
      return {
        name: comment.author.name,
        comment: comment.text,
        date: new Date().toLocaleString().slice(0, -3),
        like: comment.likes,
        user_Like:false,
      };
    })
    console.log(formatComments);
    // получили данные и рендерим их в приложении
    commentsArray = formatComments;
    renderComments();
  });
});



// Добавление и удаление Лайков
const likes = () => {
  const like_Buttons = document.querySelectorAll('.like-button');
  like_Buttons.forEach((el, index) => {
    el.addEventListener('click', (eventlike) => {
      eventlike.stopPropagation()
      commentsArray[index].user_Like = !commentsArray[index].user_Like
      // Вариант_№1
      commentsArray[index].user_Like ? commentsArray[index].like++ : commentsArray[index].like--
      // Вариант_№2
      // if(commentsArray[index].user_Like) {
      //   commentsArray[index].user_Like = true;
      //   commentsArray[index].like++;
      // } else {
      //   commentsArray[index].like--;
      //   commentsArray[index].user_Like = false;
      // }
      renderComments();
    })
  })
};

//Редактирование комментариев
const handleEdit = (index) => {
	const handleEditElements = document.querySelectorAll(".editing");
	for ( const handleEditElement of handleEditElements) {
		handleEditElement.addEventListener("click" , (event) => {
		event.stopPropagation();
  commentsArray[index].paint = true;
  renderComments();
  // Показываем кнопку "Сохранить"
  listElement.querySelectorAll('.comment')[index].querySelector('.save-button').style.display = "block";
  renderComments();
	});
  }
};

// Cохранаяем отредактированный комментарий
const handleSave = (index) => {
	const handleSaveElements = document.querySelectorAll(".saving");
	for ( const handleSaveElement of handleSaveElements) {
		handleSaveElement.addEventListener("click" , (event) => {
			event.stopPropagation();
      // Получаем отредактированный комментарий
      const editedComment = listElement.querySelectorAll('.comment')[index].querySelector('.comment-input').value;
      // Обновляем комментарий в массиве
      commentsArray[index].comment = editedComment;
      // Устанавливаем флаг редактирования в false
      commentsArray[index].paint = false;
      // Переписываем комментарии
      renderComments();
      // Скрываем кнопку "Сохранить" после сохранения
      listElement.querySelectorAll('.comment')[index].querySelector('.save-buttons').style.display = "none";
		});
  }
};

//Добавление комментариев
const renderComments = () => {
  const commentsHtml = commentsArray.map((item, index) => {
    if (item.paint) {
      return `<li class="comment" data-index='${index}' data-id='${item.id}' >
          <div class="comment-header">
            <div>${item.name}</div>
            <div>${item.date}</div>
          </div>
          <div class="comment-body">
            <div class="comment-text">
              <textarea  class="comment-input add-text " rows="4">${item.comment}</textarea>
						  <button onclick="handleSave(${index})" class="save-buttons add-form-button saving">Сохранить</button>
            </div>
          </div>
        </li>`;
    } else {
      return `<li class="comment">
        <div class="comment-header">
          <div class="comment-name">${item.name}</div>
          <div>${item.date}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">
            <span class="comment-content  ">${item.comment}</span>
            <button class="edit-button add-form-button">Редактировать</button>
          </div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${item.like}</span>
            <button data-index='${index}' class="like-button ${item.user_Like ? "-active-like" : ""}"></button>
          </div>
        </div>
      </li>`;
    }
  }).join('');
  listElement.innerHTML = commentsHtml;
  likes();
  handleEdit();
	handleSave();

  const editButtons = document.querySelectorAll(".edit-button");
  editButtons.forEach((button, index) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      commentsArray[index].paint = true;
      renderComments();
    });
  });

  // Ответ на комментарий
  const commentElements = document.querySelectorAll(".comment");
  commentElements.forEach((comment) => {
    comment.addEventListener('click', (event) => {

      // Получаем имя и текст комментария
      const author = comment.querySelector('.comment-header .comment-name').textContent;
      const text = comment.querySelector('.comment-text .comment-content').textContent;

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
      commentsArray[index].comment = editedComment;
      commentsArray[index].paint = false;
      renderComments();
    });
  });
};
renderComments();

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

// Функция клика, валидация
buttonElement.addEventListener('click', () => {
  nameInputElement.classList.remove('error');
  commentInputElement.classList.remove('error');
  buttonElement.classList.remove("disabled-button");

  // Удаление пробелов спереди и сзади в полях ввода
  nameInputElement.value = nameInputElement.value.trim();
  commentInputElement.value = commentInputElement.value.trim();

  // Проверка на пустые поля
  if (nameInputElement.value === "" || commentInputElement.value === "") {
    nameInputElement.classList.add('error');
    commentInputElement.classList.add('error');
    buttonElement.classList.add("disabled-button");
    return;
  }

  commentsArray.push({
    name: replaceText(nameInputElement.value),
    date: formattedDate,
    comment: replaceText(commentInputElement.value),
    like: 0,
    user_Like: false,
    paint: '',
  });


    //HW_02.12
  // Добавление нового комментария и загрузка в сервер API
  fetch("https://webdev-hw-api.vercel.app/api/v1/Dmitry-Avdoshkin/comments", {
    method: 'POST',
    body: JSON.stringify({
      name: nameInputElement.value,
      text: commentInputElement.value
    })
  }).then((response) => {
    response.json().then((responseData) => {
      // после получения данных, рендер их в приложении
      // tasks = responseData.commentsArray;

      renderComments();
      nameInputElement.value = '';
      commentInputElement.value = '';
      buttonElement.disabled = true;
    });
  });


    // renderComments(); - Удаляем
    // nameInputElement.value = ''; - Перенесли выше на 264
    // commentInputElement.value = ''; - Переносим выше на 265
    // buttonElement.disabled = true; - Переносим выше на 265
});

// Удаление комментариев
deletebuttonElement.addEventListener('click', (event) =>{
  event.stopPropagation();
  const lastCommentIndex = listElement.innerHTML.lastIndexOf( '<li class="comment">' );
  if (lastCommentIndex !== -1) {
    listElement.innerHTML = listElement.innerHTML.substring( 0, lastCommentIndex );
  }

  // Не работает
  // Удаление комментария и из сервера API
  const idDelete = someElement.dataset.id;
  fetch("https://webdev-hw-api.vercel.app/api/v1/Dmitry-Avdoshkin/comments" + idDelete, {
    method: "DELETE",
  }).then((response) => {
    response.json().then((responseData) => {
      // после получения данных, рендер их в приложении
      tasks = responseData.commentsArray;
      renderComments();
    });
  });


});
renderComments();

// Нажатие для ввода ЕNTER
document.addEventListener('keyup', (event) =>{
  if (event.key === 'Enter') {
    buttonElement.click();
  }
});
