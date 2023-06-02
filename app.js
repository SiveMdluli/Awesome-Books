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
    const error = document.querySelector('.error');
    error.innerHTML = '<p>Please fill in all fields</p>';
  }

  clearError() {
    const error = document.querySelector('.error');
    error.innerHTML = '';
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
  domElements.clearError(); // clear error message
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

// Navigation function
const sections = document.querySelectorAll('.content');

function navigateToSection(sectionId) {
  const sections = document.querySelectorAll('.content');
  const section = document.querySelector(`#${sectionId}`);
  sections.forEach((s) => {
    if (s !== section) {
      s.classList.remove('active');
      s.style.display = 'none'; // hide non-active sections
    }
  });

  section.classList.add('active');
  section.style.display = 'block'; // show active section

  // Handle special cases for Add and List sections
  if (sectionId === 'add') {
    domElements.header.textContent = 'Awesome Books';
    domElements.form.style.display = 'block';
    domElements.bookDisplay.style.display = 'none';
  } else if (sectionId === 'list') {
    domElements.header.textContent = 'Awesome Books';
    domElements.form.style.display = 'none';
    domElements.bookDisplay.style.display = 'block';
  } else {
    // Reset header and hide form and book display for other sections
    domElements.header.textContent = ' Awesome Books';
    domElements.form.style.display = 'none';
    domElements.bookDisplay.style.display = 'none';
  }
}

// Event listners for the nav links
const links = document.querySelectorAll('nav a');
links.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const sectionId = link.getAttribute('href');
    navigateToSection(sectionId.substr(1));
  });
});

// DATE AND TIME
const timeElement = document.querySelector('.date');
function updateTime() {
  const date = new Date();
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  };
  const time = date.toLocaleString('en-US', options);
  const timeElement = document.querySelector('.date');
  timeElement.innerHTML = time;
  setTimeout(updateTime, 1000);
}

function init() {
  updateTime();
  setInputData();
  navigateToSection('add');
  displayBooks();
  domElements.inputTitle.addEventListener('input', saveInputData);
  domElements.inputAuthor.addEventListener('input', saveInputData);
  domElements.addButton.addEventListener('click', addBook);

  addBookToHolder(new Book('Book 1', 'Author 1'));
  addBookToHolder(new Book('Book 2', 'Author 2'));
}

document.addEventListener('DOMContentLoaded', init);
