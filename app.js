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
    this.error.className = 'error';
    this.error.textContent = 'Please fill out all fields.';
  }

  displayError() {
    this.bookDisplay.append(this.error);
  }
}

class LocalStorageHandler {
  constructor() {
    this.bookHolderKey = 'storedBooks';
    this.inputDataKey = 'inputdata';
  }

  getBookHolder() {
    return JSON.parse(localStorage.getItem(this.bookHolderKey)) || [];
  }

  saveBookHolder(bookHolder) {
    localStorage.setItem(this.bookHolderKey, JSON.stringify(bookHolder));
  }

  getInputData() {
    return JSON.parse(localStorage.getItem(this.inputDataKey)) || {};
  }

  saveInputData(inputData) {
    localStorage.setItem(this.inputDataKey, JSON.stringify(inputData));
  }

  deleteBook(index) {
    const bookHolder = this.getBookHolder();
    bookHolder.splice(index, 1);
    this.saveBookHolder(bookHolder);
  }
}

class Book {
  constructor(title, author) {
    this.title = title;
    this.author = author;
  }
}

const domElements = new DOMElements();
const localStorageHandler = new LocalStorageHandler();

function addBookToHolder(newBook) {
  const bookHolder = localStorageHandler.getBookHolder();
  // Check if the book already exists in local storage
  if (bookHolder.some((book) => book.title === newBook.title)) {
    // Book already exists, do nothing
    return;
  }
  bookHolder.push(newBook);
  localStorageHandler.saveBookHolder(bookHolder);
  displayBooks();
}

function clearInputData() {
  const inputData = { inputTitle: '', inputAuthor: '' };
  localStorageHandler.saveInputData(inputData);
}

function addBook() {
  const titleData = domElements.inputTitle.value;
  const authorData = domElements.inputAuthor.value;
  if (titleData === '' || authorData === '') {
    domElements.displayError();
    return;
  }
  const newBook = new Book(titleData, authorData);
  addBookToHolder(newBook);
  clearInputData();
  displayBooks();
  domElements.inputTitle.value = '';
  domElements.inputAuthor.value = '';
}

function displayBooks() {
  domElements.bookDisplay.innerHTML = '';
  const bookHolder = localStorageHandler.getBookHolder();
  bookHolder.forEach((book, index) => {
    const bookInstance = document.createElement('article');
    const dispTitle = `"${book.title}" by ${book.author}`; // Concatenate book title and author
    const delButton = document.createElement('button');
    delButton.textContent = 'Remove';
    delButton.setAttribute('data-index', index);
    delButton.addEventListener('click', () => {
      localStorageHandler.deleteBook(index);
      displayBooks();
    });

    bookInstance.append(document.createTextNode(dispTitle), delButton);

    domElements.bookDisplay.append(bookInstance);

    // add class to each bookInstance element based on its index
    if (index % 2 === 0) {
      bookInstance.classList.add('book-row-even');
    } else {
      bookInstance.classList.add('book-row-odd');
    }
  });
}

function saveInputData() {
  const inputData = {
    inputTitle: domElements.inputTitle.value,
    inputAuthor: domElements.inputAuthor.value,
  };
  localStorageHandler.saveInputData(inputData);
}

function setInputData() {
  const inputData = localStorageHandler.getInputData();
  domElements.inputTitle.value = inputData.inputTitle;
  domElements.inputAuthor.value = inputData.inputAuthor;
}

function init() {
  setInputData();
  displayBooks();
  domElements.inputTitle.addEventListener('input', saveInputData);
  domElements.inputAuthor.addEventListener('input', saveInputData);
  domElements.addButton.addEventListener('click', addBook);
}

document.addEventListener('DOMContentLoaded', init);
