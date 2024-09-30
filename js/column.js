import App from "./application.js";
import Note from "./note.js";

const Column = {
  draggedColumn: null,
  droppedColumn: null,
  lastId: 0,

  // манипуляции внутри колонки
  process(id = null, title = "", notes = []) {
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
    const column = document.createElement("div");
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
        let noteElement = Note.createNote(note.id, note.info);
        let dataNotes = column.querySelector("[data-notes]");
        dataNotes.append(noteElement);
      });
    }

    // отслеживание клика на создание note
    let spanAdd = column.querySelector("[data-action-addNote]");

    spanAdd.addEventListener("click", function (e) {
      let dataNotes = e.target.closest(".column").querySelector("[data-notes]");
      let note = Note.createNote();

      dataNotes.append(note);
      note.setAttribute("contenteditable", "true");
      note.focus();

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
    column.addEventListener("dragstart", Column.dragstart);
    column.addEventListener("dragend", Column.dragend);
    column.addEventListener("dragover", Column.dragover);
    column.addEventListener("drop", Column.drop);

    document.querySelector(".columns").appendChild(column);
  },

  dragstart(e) {
    e.stopPropagation();
    Column.draggedColumn = this;
    this.classList.add("dragged");

    document
      .querySelectorAll(".note")
      .forEach((noteElement) => noteElement.removeAttribute("draggable"));

    document
      .querySelectorAll(".column")
      .forEach((column) => column.classList.remove("drop"));
  },

  dragend() {
    Column.draggedColumn = null;
    Column.droppedColumn = null;
    this.classList.remove("dragged");

    document
      .querySelectorAll(".note")
      .forEach((noteElement) => noteElement.setAttribute("draggable", true));

    document
      .querySelectorAll(".column")
      .forEach((column) => column.classList.remove("under"));
  },

  dragover(e) {
    e.preventDefault();
    e.stopPropagation();

    if (Column.draggedColumn === this) {
      if (Column.droppedColumn) {
        Column.droppedColumn.classList.add(".under");
      }
      Column.droppedColumn = null;
    }
    if (!Column.draggedColumn || Column.draggedColumn === this) {
      return;
    }

    Column.droppedColumn = this;
    document
      .querySelectorAll(".column")
      .forEach((column) => column.classList.remove("under"));

    this.classList.add(".under");
  },

  drop(e) {
    if (Note.draggedNote) {
      return this.querySelector(".data-notes").append(Note.draggedNote);
    } else if (!Column.draggedColumn || Column.draggedColumn === this) {
      return;
    }

    const columnsList = Array.from(document.querySelectorAll(".column"));
    const indexA = columnsList.indexOf(this);
    const indexB = columnsList.indexOf(Column.draggedColumn);

    if (indexA < indexB) {
      this.parentElement.insertBefore(Column.draggedColumn, this);
    } else {
      this.parentElement.insertBefore(
        Column.draggedColumn,
        this.nextElementSibling
      );
    }

    document
      .querySelectorAll(".column")
      .forEach((column) => column.classList.remove("under"));
  },
};

export default Column;
