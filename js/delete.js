const btnDelete = document.querySelector(".delete");

btnDelete.addEventListener("dragover", function (e) {
  console.log("dragover");
  e.preventDefault(); 
});

btnDelete.addEventListener("drop", function (e) {
  console.log("drop");
});
