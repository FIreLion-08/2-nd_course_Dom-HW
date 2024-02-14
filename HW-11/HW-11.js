const name_Input_Element = document.getElementById('name-input');
const comment_Input_Element = document.getElementById('comment-input');
const button_Element = document.getElementById('add-button');
const list_Element = document.getElementById('list');
const delete_Button_Element = document.getElementById('delete-button');

// Массив
const comments_Array = [
  {
    name: 'Глеб Фокин',
    date: '12.02.22 12:18',
    comment: 'Это будет первый комментарий на этой странице',
    like: 3,
    userLike: false,
    paint: ''
  },
  {
    name: 'Варвара Н.',
    date: '13.02.22 19:22',
    comment: 'Мне нравится как оформлена эта страница! ❤',
    like: 75,
    userLike: true,
    paint: '-active-like'
  }
];

// Добавление и удаление Лайков
const likes = () => {
  const like_Buttons = document.querySelectorAll('.like-button');
  for (const like_Button of like_Buttons) {
    like_Button.addEventListener('click', () => {
      const index = like_Button.dataset.index;
      if (comments_Array[index].userLike === false ) {
        comments_Array[index].paint = '-active-like';
        comments_Array[index].like += 1;
        comments_Array[index].userLike = true;
      } else {
        comments_Array[index].paint = '';
        comments_Array[index].like -= 1;
        comments_Array[index].userLike = false;
      }
      render_Comments();
    });
  };
};

//Редактирование комментариев
const handle_Edit = (index) => {
	const handle_Edit_Elements = document.querySelectorAll(".editing");
	for ( const handle_Edit_Element of handle_Edit_Elements) {
		handle_Edit_Element.addEventListener("click" , (event) => {
		event.stopPropagation();
  comments_Array[index].paint = true;
  render_Comments();
  // Показываем кнопку "Сохранить"
  list_Element.querySelectorAll('.comment')[index].querySelector('.save-button').style.display = "block";
  render_Comments();
	});
  }
};

// Cохранаяем отредактированный комментарий
const handle_Save = (index) => {
	const handle_Save_Elements = document.querySelectorAll(".saving");
	for ( const handle_Save_Element of handle_Save_Elements) {
		handle_Save_Element.addEventListener("click" , (event) => {
			event.stopPropagation();
      // Получаем отредактированный комментарий
      const editedComment = list_Element.querySelectorAll('.comment')[index].querySelector('.comment-input').value;
      // Обновляем комментарий в массиве
      comments_Array[index].comment = editedComment;
      // Устанавливаем флаг редактирования в false
      comments_Array[index].paint = false;
      // Переписываем комментарии
      render_Comments();
      // Скрываем кнопку "Сохранить" после сохранения
      list_Element.querySelectorAll('.comment')[index].querySelector('.save-buttons').style.display = "none";
		});
  }
};

//Добавление комментариев
const render_Comments = () => {
  const commentsHtml = comments_Array.map((item, index) => {
    if (item.paint) {
      return `<li class="comment" data-index='${index}' >
          <div class="comment-header">
            <div>${item.name}</div>
            <div>${item.date}</div>
          </div>
          <div class="comment-body">
            <div class="comment-text">
              <textarea  class="comment-input add-text " rows="4">${item.comment}</textarea>
						  <button onclick="handle_Save(${index})" class="save-buttons add-form-button saving">Сохранить</button>
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
            <button data-index='${index}' class="like-button ${item.userLike ? "-active-like" : ""}"></button>
          </div>
        </div>
      </li>`;
    }
  }).join('');
  list_Element.innerHTML = commentsHtml;
  likes();
  handle_Edit();
	handle_Save();

  const edit_Buttons = document.querySelectorAll(".edit-button");
  edit_Buttons.forEach((button, index) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      comments_Array[index].paint = true;
      render_Comments();
    });
  });

  // Ответ на комментарий
  const comment_Elements = document.querySelectorAll(".comment");
  comment_Elements.forEach((comment) => {
    comment.addEventListener('click', (event) => {

      // Получаем имя и текст комментария
      const author = comment.querySelector('.comment-header .comment-name').textContent;
      const text = comment.querySelector('.comment-text .comment-content').textContent;

      // Формируем ответную цитату для вставки в поле комментария
      const quotedText = `> ${text}\n\n @${author}, `;
      document.getElementById('comment-input').value = quotedText;
      render_Comments();
    });
  });

  //Кнопка сохранения после редактирования
  const save_Buttons = document.querySelectorAll(".save-button");
  save_Buttons.forEach((button, index) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const editedComment = button.parentNode.nextElementSibling.children[0].children[0].value;
      comments_Array[index].comment = editedComment;
      comments_Array[index].paint = false;
      render_Comments();
    });
  });
};

render_Comments();


// Условие не активной кнопки
button_Element.disabled = true;
name_Input_Element.addEventListener('input', () =>{
  if (name_Input_Element.value === " " || comment_Input_Element.value === " ") {
    button_Element.disabled = true;
    return;
  } else {
    button_Element.disabled = false;
  }
});

// Функция клика, валидация
button_Element.addEventListener('click', () => {
    name_Input_Element.classList.remove('error');
    comment_Input_Element.classList.remove('error');
    button_Element.classList.remove("disabled-button");

    // Удаление пробелов спереди и сзади в полях ввода
    name_Input_Element.value = name_Input_Element.value.trim();
    comment_Input_Element.value = comment_Input_Element.value.trim();

    // Проверка на пустые поля
    if (name_Input_Element.value === "" || comment_Input_Element.value === "") {
      name_Input_Element.classList.add('error');
      comment_Input_Element.classList.add('error');
      button_Element.classList.add("disabled-button");
      return;
    }

  // Установка формата даты ДД.ММ.ГГГГ ЧЧ:ММ
  const date = new Date();
  const formattedDate =
  date.getDate().toString().padStart(2, '0') + '.' +
  (date.getMonth() + 1).toString().padStart(2, '0') + '.' +
  date.getFullYear().toString().slice(-2) + ' ' +
  date.getHours().toString().padStart(2, '0') + ':' +
  date.getMinutes().toString().padStart(2, '0');

  comments_Array.push({
      name: name_Input_Element.value
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;"),
      date: formattedDate,
      comment: comment_Input_Element.value
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;"),
      like: 0,
      userLike: false,
      paint: '',
  });
    render_Comments();
    name_Input_Element.value = '';
    comment_Input_Element.value = '';
    button_Element.disabled = true;
});
//
delete_Button_Element.addEventListener('click', () =>{
  const lastCommentIndex = list_Element.innerHTML.lastIndexOf( '<li class="comment">' );
  if (lastCommentIndex !== -1) {
    list_Element.innerHTML = list_Element.innerHTML.substring( 0, lastCommentIndex );
  }
});
// Нажатие для ввода ЕNTER
document.addEventListener('keyup', (event) =>{
  if (event.key === 'Enter') {
    button_Element.click();
  }
});
