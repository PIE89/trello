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
    Column.process(columns.id, columns.title, columns.notes);
  });
}

// создание новой колонки (прослушка кнопки добавления новой колонки)
document
  .querySelector("[data-action-addcolumn]")
  .addEventListener("click", function () {
    Column.process();
    App.saveLS();
  });
