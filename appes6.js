class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');
    //create tr
    const row = document.createElement('tr');
    //cols
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X</td>
    `;

    list.appendChild(row);
  }

  showAlert(message, className) {
    //create div
    const div = document.createElement('div');
    //add classes
    div.className = `alert ${className}`;
    //add text
    div.appendChild(document.createTextNode(message));
    //get parent
    const container = document.querySelector('.container');
    //get form
    const form = document.querySelector('#book-form');
    //insert alert
    container.insertBefore(div, form);

    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000);

  }
  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }

  }
  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';

  }
}

//local storage Class

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];

    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function (book) {
      const ui = new UI();

      //add book to ui
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));

  }
  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}

//DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

//event listeners 

document.getElementById('book-form').addEventListener('submit', function (e) {
  //get form values
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const isbn = document.getElementById('isbn').value;

  //instantiate a book
  const book = new Book(title, author, isbn);

  //instantiate ui
  const ui = new UI();

  //validate
  if (title === '' || author === '' || isbn === '') {
    //Error alert
    ui.showAlert('Please fill in all fields', 'error');
  } else {
    //add book to the list
    ui.addBookToList(book);

    //add to local storage
    Store.addBook(book);

    //insert alert
    ui.showAlert('Book added', 'sucess');

    //clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

//event listener for delete 

document.getElementById('book-list').addEventListener('click', function (e) {

  const ui = new UI();

  ui.deleteBook(e.target);
  //remove from ls
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //show message
  ui.showAlert('book removed', 'sucess');

  e.preventDefault();
});