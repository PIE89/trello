const btnDelete = document.querySelector(".delete");

btnDelete.addEventListener("drop", function (e) {
  console.log("drop"); // Не работает, так как элемент btnDelete спозиционирован абсолютно
});
