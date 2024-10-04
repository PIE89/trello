import App from "./application.js";
import Note from "./note.js";

export default class Column {
  constructor(id = null, title = "", notes = []) {
    let res;
    if (title.length > 0) {
      res = title;
    } else {
      res = prompt("Введите название колонки");
    }

    if (id) {
      Column.lastId = id;
    } else {
      ++Column.lastId;
    }

    if (res.trim().length === 0) {
      return;
    }

    // создание колонки
    const column = (this.column = document.createElement("div"));
    column.classList.add("column");
    column.setAttribute("draggable", "true");
    column.setAttribute("data-column-id", Column.lastId);
    column.innerHTML = `<p class="column-header">${res}</p>
            <div data-notes class="data-notes"></div>
            <p class="column-footer">
              <span data-action-addNote class="action"
                >+ Добавить карточку</span
              >
            </p>`;

    // создание notes (если есть данные)
    if (notes.length > 0) {
      notes.forEach((note) => {
        let noteElement = new Note(note.id, note.info);
        let dataNotes = column.querySelector("[data-notes]");
        dataNotes.append(noteElement.note);
      });
    }

    // отслеживание клика на создание note
    let spanAdd = column.querySelector("[data-action-addNote]");

    spanAdd.addEventListener("click", function (e) {
      let dataNotes = e.target.closest(".column").querySelector("[data-notes]");
      let note = new Note();

      if (note.note) {
        dataNotes.append(note.note);
        note.note.setAttribute("contenteditable", "true");
      }

      // cохраняем полученные данные в LS
      App.saveLS();
    });

    // редактирование заголовка столбцов
    const header = column.querySelector(".column-header");

    header.addEventListener("dblclick", function editColumnTitle(e) {
      header.setAttribute("contenteditable", "true");
      header.focus();
    });

    header.addEventListener("blur", function () {
      header.removeAttribute("contenteditable");

      App.saveLS();
    });

    // перетаскивание колонок
    this.column.addEventListener("dragstart", this.dragstart.bind(this));
    this.column.addEventListener("dragend", this.dragend.bind(this));
    this.column.addEventListener("dragover", this.dragover.bind(this));
    this.column.addEventListener("drop", this.drop.bind(this));

    document.querySelector(".columns").appendChild(column);
  }

  dragstart(e) {
    e.stopPropagation();
    Column.draggedColumn = this.column;
    this.column.classList.add("dragged");

    document
      .querySelectorAll(".note")
      .forEach((noteElement) => noteElement.removeAttribute("draggable"));

    document
      .querySelectorAll(".column")
      .forEach((column) => column.classList.remove("drop"));
  }

  dragend() {
    Column.draggedColumn = null;
    Column.droppedColumn = null;
    this.column.classList.remove("dragged");

    document
      .querySelectorAll(".note")
      .forEach((noteElement) => noteElement.setAttribute("draggable", true));

    document
      .querySelectorAll(".column")
      .forEach((column) => column.classList.remove("under"));

    App.saveLS();
  }

  dragover(e) {
    e.preventDefault();
    e.stopPropagation();

    if (Column.draggedColumn === this.column) {
      if (Column.droppedColumn) {
        Column.droppedColumn.classList.add(".under");
      }
      Column.droppedColumn = null;
    }
    if (!Column.draggedColumn || Column.draggedColumn === this.column) {
      return;
    }

    Column.droppedColumn = this.column;
    document
      .querySelectorAll(".column")
      .forEach((column) => column.classList.remove("under"));

    this.column.classList.add(".under");
  }

  drop(e) {
    if (Note.draggedNote) {
      return this.column.querySelector(".data-notes").append(Note.draggedNote);
    } else if (!Column.draggedColumn || Column.draggedColumn === this.column) {
      return;
    }

    const columnsList = Array.from(document.querySelectorAll(".column"));
    const indexA = columnsList.indexOf(this.column);
    const indexB = columnsList.indexOf(Column.draggedColumn);

    if (indexA < indexB) {
      this.column.parentElement.insertBefore(Column.draggedColumn, this.column);
    } else {
      this.column.parentElement.insertBefore(
        Column.draggedColumn,
        this.column.nextElementSibling
      );
    }

    document
      .querySelectorAll(".column")
      .forEach((column) => column.classList.remove("under"));
  }
}

Column.draggedColumn = null;
Column.droppedColumn = null;
Column.lastId = 0;
