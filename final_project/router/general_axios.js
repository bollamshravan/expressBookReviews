const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Assuming we have a URL to fetch the books list
const booksUrl = 'https://api.example.com/books';

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    axios.get(booksUrl)
        .then(response => {
            const books = response.data;
            return res.status(200).json(books);
        })
        .catch(error => {
            return res.status(500).json({ message: "Failed to fetch books list", error: error.message });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const booksByAuthor = [];
    bookKeys.forEach(key => {
        if (books[key].author === author) {
            booksByAuthor.push(books[key]);
        }
    });
    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    const booksByTitle = [];
    bookKeys.forEach(key => {
        if (books[key].title === title) {
            booksByTitle.push(books[key]);
        }
    });
    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json({ Reviews: book.reviews });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});