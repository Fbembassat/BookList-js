// la class Book : représente un livre

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class : opére les tâches UI

class UI {
    static displayBooks() {

        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // le message disparait après 3 sec

        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store class : s'occupe du stockage

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

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event : affiche les livres

document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event : ajoute un livre

document.querySelector('#book-form').addEventListener('submit', (e) => {
    // prevent le bouton submit

    e.preventDefault();

    // avoir les données du formulaire

    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validation

    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {

    // instantié le livre

    const book = new Book(title, author, isbn);

    // ajouter le livre a l'UI

    UI.addBookToList(book);

    // ajouter un livre au store

    Store.addBook(book);

    // affiche le message de succès

    UI.showAlert('Book Added', 'success')

    // Nettoyer les champs

    UI.clearFields();
        
    }

});

// Event : retire un livre

document.querySelector('#book-list').addEventListener('click', (e) => {

    // retirer le livre de l'UI

    UI.deleteBook(e.target);

    // retirer le livre du store

    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // affiche le message de succès

    UI.showAlert('Book Removed', 'success')
});