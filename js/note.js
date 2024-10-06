import App from './application.js';

export default class Note {
	constructor(id, info) {
		if (typeof info === 'undefined') {
			let res = prompt('Введите значение');
			info = res.trim();
		}

		if (info.length === 0) {
			return;
		}

		if (id) {
			Note.lastId = id;
		} else {
			++Note.lastId;
		}

		const note = (this.note = document.createElement('div'));
		note.classList.add('note');
		note.setAttribute('draggable', 'true');
		note.setAttribute('data-note-id', Note.lastId);
		note.innerText = info;

		//редактирование текста
		note.addEventListener('dblclick', function editNote(e) {
			note.setAttribute('contenteditable', 'true');
			note.removeAttribute('draggable');
			note.closest('.column').removeAttribute('draggable');
			note.focus();
		});

		note.addEventListener('blur', function () {
			note.removeAttribute('contenteditable');
			note.setAttribute('draggable', 'true');
			note.closest('.column').setAttribute('draggable', 'true');

			if (note.innerText.length == 0) {
				note.remove();
			}

			App.saveLS();
		});

		// перетаскивание карточки
		note.addEventListener('dragstart', this.dragstart.bind(this));
		note.addEventListener('dragend', this.dragend.bind(this));
		note.addEventListener('dragenter', this.dragenter.bind(this));
		note.addEventListener('dragover', this.dragover.bind(this));
		note.addEventListener('dragleave', this.dragleave.bind(this));
		note.addEventListener('drop', this.drop.bind(this));
	}

	// Функции по движению/перемещению с note

	dragstart(e) {
		e.stopPropagation();
		Note.draggedNote = this.note;
		this.note.classList.add('dragged');

		document
			.querySelectorAll('.note')
			.forEach((note) => note.classList.remove('drop'));
	}

	dragend(e) {
		Note.draggedNote = null;
		this.note.classList.remove('dragged');

		document
			.querySelectorAll('.note')
			.forEach((elem) => elem.classList.remove('under'));

		e.stopPropagation();

		App.saveLS();
	}

	dragenter() {
		if (Note.draggedNote === this.note) {
			return;
		}

		this.note.classList.add('under');
	}

	dragover(e) {
		e.preventDefault();
		if (Note.draggedNote === this.note) {
			return;
		}
	}

	dragleave() {
		if (Note.draggedNote === this.note) {
			return;
		}
		this.note.classList.remove('under');
	}

	drop(e) {
		e.stopPropagation();

		if (!Note.draggedNote || Note.draggedNote === this.note) {
			return;
		}

		if (this.note.parentElement === Note.draggedNote.parentElement) {
			const noteList = Array.from(
				this.note.parentElement.querySelectorAll('.note')
			);

			console.log(115, this.note);
			console.log(116, Note.draggedNote);

			const indexA = noteList.indexOf(this.note); // Куда бросил
			const indexB = noteList.indexOf(Note.draggedNote); // Карточка которую тянул

			if (indexA < indexB) {
				this.note.parentElement.insertBefore(
					Note.draggedNote,
					this.note
				);
			} else {
				this.note.parentElement.insertBefore(
					Note.draggedNote,
					this.note.nextElementSibling
				);
			}
		} else {
			this.note.parentElement.insertBefore(Note.draggedNote, this.note);
		}
	}
}

Note.draggedNote = null;
Note.lastId = 0;
