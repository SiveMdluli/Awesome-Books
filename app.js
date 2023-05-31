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

class BookApp {
  constructor() {
    this.domElements = new DOMElements();
    this.localStorageHandler = new LocalStorageHandler();
    this.bookHolder = this.localStorageHandler.getBookHolder();
    this.inputData = this.localStorageHandler.getInputData();
    this.addBook = this.addBook.bind(this);
    this.deleteBook = this.deleteBook.bind(this);
  }

  addBookToHolder(newBook) {
    this.bookHolder.push(newBook);
    this.localStorageHandler.saveBookHolder(this.bookHolder);
  }

  clearInputData() {
    this.inputData = { inputTitle: '', inputAuthor: '' };
    this.localStorageHandler.saveInputData(this.inputData);
  }

  addBook() {
    const titleData = this.domElements.inputTitle.value;
    const authorData = this.domElements.inputAuthor.value;
    if (titleData === '' || authorData === '') {
      this.domElements.displayError();
      return;
    }
    const newBook = new Book(titleData, authorData);
    this.addBookToHolder(newBook);
    this.clearInputData();
    this.displayBooks();
  }

  deleteBook(event) {
    const index = event.target.getAttribute('data-index');
    this.localStorageHandler.deleteBook(index);
    this.displayBooks();
  }

  displayBooks() {
    this.domElements.bookDisplay.innerHTML = '';
    this.bookHolder.forEach((book, index) => {
      const bookInstance = document.createElement('article');
      const dispTitle = document.createElement('h2');
      dispTitle.textContent = book.title;
      const dispAuthor = document.createElement('p');
      dispAuthor.textContent = book.author;
      const delButton = document.createElement('button');
      delButton.textContent = 'remove';
      delButton.setAttribute('data-index', index);
      delButton.addEventListener('click', this.deleteBook);
      const hrline = document.createElement('hr');
      bookInstance.append(dispTitle, dispAuthor, delButton, hrline);
      this.domElements.bookDisplay.append(bookInstance);
    });
  }

  saveInputData() {
    this.inputData.inputTitle = this.domElements.inputTitle.value;
    this.inputData.inputAuthor = this.domElements.inputAuthor.value;
    this.localStorageHandler.saveInputData(this.inputData);
  }

  setInputData() {
    this.domElements.inputTitle.value = this.inputData.inputTitle;
    this.domElements.inputAuthor.value = this.inputData.inputAuthor;
  }

  init() {
    this.setInputData();
    this.displayBooks();
    this.domElements.inputTitle.addEventListener(
      'input',
      this.saveInputData.bind(this)
    );
    this.domElements.inputAuthor.addEventListener(
      'input',
      this.saveInputData.bind(this)
    );
    this.domElements.addButton.addEventListener('click', this.addBook);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const bookApp = new BookApp();
  bookApp.init();
});
