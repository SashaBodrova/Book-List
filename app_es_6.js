class Book {
    constructor(title, author, isbn) {
      this.title = title;
      this.author = author;
      this.isbn = isbn;
    };
};

// Here will be methods to deal with User Interface
class UI {
    addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href='#' class='delete'>X</a></td>`;

        list.appendChild(row);
    };

    showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const  form = document.querySelector('#book-form');

        container.insertBefore(div, form);

        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    };

    deleteBook(target) {
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        };
    };

    clearFields() {
        document.querySelector('#title').value = '',
            document.querySelector('#author').value = '',
            document.querySelector('#isbn').value = '';
    };
};

// Local Storage Class
class Store {
    static getBooks(){
        let books;
        if (localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        };

        return books;
    };

    static displayBooks(){
        const books = Store.getBooks();

        books.forEach(function(book){
            const ui = new UI;

            //Add book to UI
            ui.addBookToList(book);
        });
    };

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    };

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach(function(book, index){
            if (book.isbn === isbn){
                books.splice(index, 1);
            };
        });
        localStorage.setItem('books', JSON.stringify(books));
    };
};

// Event Listeners

//DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks)

document.querySelector('#book-form').addEventListener('submit', function(e){
    const title = document.querySelector('#title').value,
          author = document.querySelector('#author').value,
          isbn = document.querySelector('#isbn').value;

    const book = new Book(title, author, isbn);
    const ui = new UI();

    if(title === '' || author === '' || isbn === ''){
        ui.showAlert('Please, fill in all fields', 'error'); // here we call method from 14th point
    } else {
        ui.addBookToList(book);

        // Add to LS
        // we do not need to instantiate, cos' it is a static method
        // so, we can use it directly
        Store.addBook(book);

        ui.showAlert('Book added!', 'success');

        ui.clearFields();
    };

    e.preventDefault();
});

document.querySelector('#book-list').addEventListener('click', function(e){
    const ui = new UI();

    ui.deleteBook(e.target);

    // Remove from LS
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    ui.showAlert('Book Removed!', 'success');

    e.preventDefault(); // you remember what is it
});