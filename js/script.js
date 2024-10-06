import Column from "./column.js";
import App from "./application.js";
import getImage from "./api.js";
let body = document.querySelector("body");

// fetch на background
let urlInfo = await getImage();
body.style.backgroundImage = `url(${urlInfo})`;
body.style.backgroundSize = "cover";
body.style.backgroundPosition = "center";

// проверяем LS
let data = App.loadLS();

if (data) {
  data.forEach((columns) => {
    new Column(columns.id, columns.title, columns.notes);
  });
}

// создание новой колонки (прослушка кнопки добавления новой колонки)
document
  .querySelector("[data-action-addcolumn]")
  .addEventListener("click", function () {
    new Column();
    App.saveLS();
  });

// Получаем элемент с классом .delete, который будет использоваться для удаления.
const btnDelete = document.querySelector(".delete");

// Добавляем обработчик события 'dragover' на элемент btnDelete.
// Это событие срабатывает, когда объект перетаскивается над элементом.
btnDelete.addEventListener("dragover", (event) => {
  // Отключаем поведение по умолчанию для события 'dragover'.
  // Без этого браузер не разрешит сбрасывать перетаскиваемый объект.
  event.preventDefault();
});

// Добавляем обработчик события 'drop' на элемент btnDelete.
// Это событие срабатывает, когда объект сбрасывается на элемент.
btnDelete.addEventListener("drop", function (event) {
  // Отключаем поведение по умолчанию для события 'drop'.
  event.preventDefault();

  Column.draggedColumn.remove();
});
