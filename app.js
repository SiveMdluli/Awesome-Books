class DOMElements {
  constructor() {
    this.container = document.querySelector('.container');
    this.header = document.querySelector('.Pagetitle');
    this.form = document.querySelector('.form');
    this.bookDisplay = document.querySelector('.bookDisplay');
    this.inputTitle = document.querySelector('.title');
    this.inputAuthor = document.querySelector('.author');
    this.addButton = document.querySelector('.add');
    this.error = document.createElement('span');
    this.error.textContent = 'Please fill out all fields.';
  }

  // Method to add an error message to the bookDisplay
  displayError() {
    this.bookDisplay.append(this.error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const domElements = new DOMElements();

  // Rest of your code here...

  // My Books constructor, for the user input
  class Book {
    constructor(title, author) {
      this.title = title;
      this.author = author;
    }
  }

  let bookHolder = [];

  class LocalStorageHandler {
    constructor() {
      this.bookHolderKey = 'storedBooks';
      this.inputDataKey = 'inputdata';
    }
  
    // Method to retrieve the book holder array from local storage
    getBookHolder() {
      return JSON.parse(localStorage.getItem(this.bookHolderKey)) || [];
    }
  
    // Method to save the book holder array to local storage
    saveBookHolder(bookHolder) {
      localStorage.setItem(this.bookHolderKey, JSON.stringify(bookHolder));
    }
  
    // Method to retrieve the input data object from local storage
    getInputData() {
      return JSON.parse(localStorage.getItem(this.inputDataKey)) || {};
    }
  
    // Method to save the input data object to local storage
    saveInputData(inputData) {
      localStorage.setItem(this.inputDataKey, JSON.stringify(inputData));
    }
  }

  function inputSave() {
    inputStorage.inputTitle = inputTitle.value;
    inputStorage.inputAuthor = inputAuthor.value;
    localStorage.setItem('inputdata', JSON.stringify(inputStorage));
  }

  // Adding a new book to the bookHolder array and updating localStorage and the UI
  function addBook() {
    const titleData = inputTitle.value;
    const authorData = inputAuthor.value;
    const newBook = new Book(titleData, authorData);
    bookHolder.push(newBook);
    localStorage.setItem('storedBooks', JSON.stringify(bookHolder));
    inputTitle.value = '';
    inputAuthor.value = '';
    inputSave();
    display();
  }

  // Creating a new book instance and appending it to the bookDisplay div
  function display() {
    bookDisplay.innerHTML = ''; // Clearing the previous instances before displaying the updated ones
    bookHolder.forEach((book, index) => {
      const bookInstance = document.createElement('article');
      const dispTitle = document.createElement('h2');
      dispTitle.textContent = book.title;
      const dispAuthor = document.createElement('p');
      dispAuthor.textContent = book.author;
      const delButton = document.createElement('button');
      delButton.textContent = 'remove';
      delButton.setAttribute('data-index', index);
      delButton.addEventListener('click', deleteBook);
      const hrline = document.createElement('hr');
      bookInstance.append(dispTitle, dispAuthor, delButton, hrline);
      bookDisplay.append(bookInstance);
    });
  }

  // Removing a book from the bookHolder array and updating localStorage and the UI
  function deleteBook(event) {
    const index = event.target.getAttribute('data-index');
    bookHolder.splice(index, 1);
    localStorage.setItem('storedBooks', JSON.stringify(bookHolder));
    display();
  }

  // Creating an error message and displaying it when the user submits an empty form
  const error = document.createElement('span');
  error.textContent = 'Please fill out all fields.';

  addButton.addEventListener('click', () => {
    if (inputTitle.value === '' || inputAuthor.value === '') {
      bookDisplay.append(error);
    } else {
      addBook();
    }
  });
});

// Creating a new book instance and appending it to the bookDisplay div
function display() {
  bookDisplay.innerHTML = ''; // Clearing the previous instances before displaying the updated ones
  bookHolder.forEach((book, index) => {
    const bookInstance = document.createElement('article');
    const dispTitle = document.createElement('h2');
    dispTitle.textContent = book.title;
    const dispAuthor = document.createElement('p');
    dispAuthor.textContent = book.author;
    const delButton = document.createElement('button');
    delButton.textContent = 'remove';
    delButton.setAttribute('data-index', index);
    delButton.addEventListener('click', deleteBook);
    const hrline = document.createElement('hr');
    bookInstance.append(dispTitle, dispAuthor, delButton, hrline);
    bookDisplay.append(bookInstance);
  });
}
// Removing a book from the bookHolder array and updating localStorage and the UI
function deleteBook(event) {
  const index = event.target.getAttribute('data-index');
  bookHolder.splice(index, 1);
  localStorage.setItem('storedBooks', JSON.stringify(bookHolder));
  display();
}
// Creating an error message and displaying it when the user submits an empty form
const error = document.createElement('span');
error.textContent = 'Please fill out all fields.';
addButton.addEventListener('click', () => {
  if (inputTitle.value === '' || inputAuthor.value === '') {
    bookDisplay.append(error);
  } else {
    addBook();
  }
});
