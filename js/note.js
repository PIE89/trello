import App from "./application.js";

const Note = {
  draggedNote: null,
  lastId: 0,

  createNote(id, info = "") {
    let res;
    if (info.length > 0) {
      res = info;
    } else {
      res = prompt("Введите название");
    }

    if (id) {
      Note.lastId = id;
    } else {
      ++Note.lastId;
    }

    let note = document.createElement("div");
    note.classList.add("note");
    note.setAttribute("draggable", "true");
    note.setAttribute("data-note-id", Note.lastId);
    note.textContent = res;

    //редактирование текста
    note.addEventListener("dblclick", function editNote(e) {
      note.setAttribute("contenteditable", "true");
      note.removeAttribute("draggable");
      note.closest(".column").removeAttribute("draggable");
      note.focus();
    });

    note.addEventListener("blur", function () {
      note.removeAttribute("contenteditable");
      note.setAttribute("draggable", "true");
      note.closest(".column").setAttribute("draggable", "true");

      console.log("все сделано");
      App.saveLS();
    });

    // перетаскивание карточки
    note.addEventListener("dragstart", Note.dragstart);
    note.addEventListener("dragend", Note.dragend);
    note.addEventListener("dragenter", Note.dragenter);
    note.addEventListener("dragover", Note.dragover);
    note.addEventListener("dragleave", Note.dragleave);
    note.addEventListener("drop", Note.drop);

    return note;
  },

  // Функции по манипуляции с note

  dragstart(e) {
    e.stopPropagation();
    Note.draggedNote = this;
    this.classList.add("dragged");

    document
      .querySelectorAll(".note")
      .forEach((note) => note.classList.remove("drop"));
  },

  dragend(e) {
    Note.draggedNote = null;
    this.classList.remove("dragged");

    document
      .querySelectorAll(".note")
      .forEach((elem) => elem.classList.remove("under"));

    e.stopPropagation();
  },

  dragenter() {
    if (Note.draggedNote === this) {
      return;
    }

    this.classList.add("under");
  },

  dragover(e) {
    e.preventDefault();
    if (Note.draggedNote === this) {
      return;
    }
  },

  dragleave() {
    if (Note.draggedNote === this) {
      return;
    }
    this.classList.remove("under");
  },

  drop(e) {
    e.stopPropagation();
    if (!Note.draggedNote || Note.draggedNote === this) {
      return;
    }

    if (this.parentElement === Note.draggedNote.parentElement) {
      const noteList = Array.from(this.parentElement.querySelectorAll(".note"));
      const indexA = noteList.indexOf(this);
      const indexB = noteList.indexOf(Note.draggedNote);

      if (indexA < indexB) {
        this.parentElement.insertBefore(Note.draggedNote, this);
      } else {
        this.parentElement.insertBefore(
          Note.draggedNote,
          this.nextElementSibling
        );
      }
    } else {
      this.parentElement.insertBefore(Note.draggedNote, this);
    }
  },
};

export default Note;
