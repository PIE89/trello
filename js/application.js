const App = {
  saveLS() {
    let data = [];

    document.querySelectorAll(".column").forEach((columnElement) => {
      const column = {
        id: Number(columnElement.getAttribute("data-column-id")),
        title: columnElement.querySelector(".column-header").textContent,
        notes: [],
      };

      columnElement.querySelectorAll(".note").forEach((noteElement) => {
        column.notes.push({
          id: Number(noteElement.getAttribute("data-note-id")),
          info: noteElement.innerText,
        });
      });
      data.push(column);
    });

    localStorage.setItem("trelloInfo", JSON.stringify(data));
  },

  loadLS() {
    return JSON.parse(localStorage.getItem("trelloInfo"));
  },
};

export default App;
