document.addEventListener("DOMContentLoaded", () => {
  // Selecting the necessary elements from the HTML file
  const container = document.querySelector(".container");
  const header = document.querySelector(".Pagetitle");
  const form = document.querySelector(".form");
  const bookDisplay = document.querySelector(".bookDisplay");
  const inputTitle = document.querySelector(".title");
  const inputAuthor = document.querySelector(".author");
  const addButton = document.querySelector(".add");

  //My Books constructor, for the user input
  class Book {
    constructor(title, author) {
      this.title = title;
      this.author = author;
    }
  }

  let bookHolder = [];

  // Retrieving stored books from localStorage and displaying them
  if (localStorage.getItem("storedBooks")) {
    bookHolder = JSON.parse(localStorage.getItem("storedBooks"));
    display();
  }

  // Retrieving stored input data from localStorage and setting it to the input fields
  const inputStorage = JSON.parse(localStorage.getItem("inputdata")) || {};
  inputTitle.value = inputStorage.inputTitle || "";
  inputAuthor.value = inputStorage.inputAuthor || "";

  // Saving input data to localStorage whenever the input fields change
  inputTitle.addEventListener("input", inputSave);
  inputAuthor.addEventListener("input", inputSave);

  function inputSave() {
    inputStorage.inputTitle = inputTitle.value;
    inputStorage.inputAuthor = inputAuthor.value;
    localStorage.setItem("inputdata", JSON.stringify(inputStorage));
  }

  // Adding a new book to the bookHolder array and updating localStorage and the UI
  function addBook() {
    const titleData = inputTitle.value;
    const authorData = inputAuthor.value;
    const newBook = new Book(titleData, authorData);
    bookHolder.push(newBook);
    localStorage.setItem("storedBooks", JSON.stringify(bookHolder));
    inputTitle.value = "";
    inputAuthor.value = "";
    inputSave();
    display();
  }

  // Creating a new book instance and appending it to the bookDisplay div
  function display() {
    bookDisplay.innerHTML = ""; // Clearing the previous instances before displaying the updated ones
    bookHolder.forEach((book, index) => {
      const bookInstance = document.createElement("article");
      const dispTitle = document.createElement("h2");
      dispTitle.textContent = book.title;
      const dispAuthor = document.createElement("p");
      dispAuthor.textContent = book.author;
      const delButton = document.createElement("button");
      delButton.textContent = "remove";
      delButton.setAttribute("data-index", index);
      delButton.addEventListener("click", deleteBook);
      const hrline = document.createElement("hr");
      bookInstance.append(dispTitle, dispAuthor, delButton, hrline);
      bookDisplay.append(bookInstance);
    });
  }

  // Removing a book from the bookHolder array and updating localStorage and the UI
  function deleteBook(event) {
    const index = event.target.getAttribute("data-index");
    bookHolder.splice(index, 1);
    localStorage.setItem("storedBooks", JSON.stringify(bookHolder));
    display();
  }

  // Creating an error message and displaying it when the user submits an empty form
  const error = document.createElement("span");
  error.textContent = "Please fill out all fields.";

  addButton.addEventListener("click", () => {
    if (inputTitle.value === "" || inputAuthor.value === "") {
      bookDisplay.append(error);
    } else {
      addBook();
    }
  });
});
