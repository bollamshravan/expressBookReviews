const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  // Extract the username and password from the request body
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists in the users array
  const userExists = users.some(user => user.username === username);

  // If the username already exists, return a 409 status code with a message
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }
  else{
  // If the username does not exist, add the new user to the users array
  users.push({ username, password });
  // Return a 201 status code with a success message
  return res.status(201).json({ message: "User registered successfully" });
  }

   // Return error if username or password is missing
   return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Simulate an asynchronous operation using a Promise
  new Promise((resolve, reject) => {
    // Simulate a delay
    setTimeout(() => {
      resolve(books);
    }, 1000);
  })
  .then(books => {
    // Send the JSON string as a response with a status code of 200
    return res.status(200).json({ Books: books });
  })
  .catch(error => {
    // Handle any errors
    return res.status(500).json({ message: "Failed to fetch books list", error: error.message });
  });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
   // Retrieve the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Simulate an asynchronous operation using a Promise
  new Promise((resolve, reject) => {
    // Simulate a delay
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    }, 1000);
  })
  .then(book => {
    // Send the book details as a response with a status code of 200
    return res.status(200).json(book);
  })
  .catch(error => {
    // Handle any errors
    return res.status(404).json({ message: error.message });
  });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  // Simulate an asynchronous operation using a Promise
  new Promise((resolve, reject) => {
    // Simulate a delay
    setTimeout(() => {
      const bookKeys = Object.keys(books);
      const booksByAuthor = [];
      bookKeys.forEach(key => {
        if (books[key].author === author) {
          booksByAuthor.push(books[key]);
        }
      });
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject(new Error("No books found by this author"));
      }
    }, 1000);
  })
  .then(booksByAuthor => {
    // Send the books by author as a response with a status code of 200
    return res.status(200).json(booksByAuthor);
  })
  .catch(error => {
    // Handle any errors
    return res.status(404).json({ message: error.message });
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  // Simulate an asynchronous operation using a Promise
  new Promise((resolve, reject) => {
    // Simulate a delay
    setTimeout(() => {
      const bookKeys = Object.keys(books);
      const booksByTitle = [];
      bookKeys.forEach(key => {
        if (books[key].title === title) {
          booksByTitle.push(books[key]);
        }
      });
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject(new Error("No books found with this title"));
      }
    }, 1000);
  })
  .then(booksByTitle => {
    // Send the books by title as a response with a status code of 200
    return res.status(200).json(booksByTitle);
  })
  .catch(error => {
    // Handle any errors
    return res.status(404).json({ message: error.message });
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  // Simulate an asynchronous operation using a Promise
  new Promise((resolve, reject) => {
    // Simulate a delay
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book.reviews);
      } else {
        reject(new Error("Book not found"));
      }
    }, 1000);
  })
  .then(reviews => {
    // Send the book reviews as a response with a status code of 200
    return res.status(200).json({ Reviews: reviews });
  })
  .catch(error => {
    // Handle any errors
    return res.status(404).json({ message: error.message });
  });
});

module.exports.general = public_users;
