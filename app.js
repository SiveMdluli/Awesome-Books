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
}
class Book {
  constructor(title, author) {
    this.title = title;
    this.author = author;
  }
}
const domElements = new DOMElements();
const localStorageHandler = new LocalStorageHandler();
const bookHolder = localStorageHandler.getBookHolder();
let inputData = localStorageHandler.getInputData();
function addBookToHolder(newBook) {
  bookHolder.push(newBook);
  localStorageHandler.saveBookHolder(bookHolder);
}
function clearInputData() {
  inputData = { inputTitle: '', inputAuthor: '' };
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
}
function displayBooks() {
  domElements.bookDisplay.innerHTML = '';
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
    domElements.bookDisplay.append(bookInstance);
  });
}
function deleteBook(event) {
  const index = event.target.getAttribute('data-index');
  bookHolder.splice(index, 1);
  localStorageHandler.saveBookHolder(bookHolder);
  displayBooks();
}
function saveInputData() {
  inputData.inputTitle = domElements.inputTitle.value;
  inputData.inputAuthor = domElements.inputAuthor.value;
  localStorageHandler.saveInputData(inputData);
}
function setInputData() {
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
