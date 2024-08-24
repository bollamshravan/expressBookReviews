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
public_users.get('/',function (req, res) {
  //Write your code here
  // Send the JSON string as a response with a status code of 200
  return res.status(200).json({Books: books}, null, 2);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
   // Retrieve the ISBN from the request parameters
   const isbn = req.params.isbn;
  
   // Find the book in the books object using the ISBN
   const book = books[isbn];
   
   // If the book is found, return the book details
   if (book) {
     return res.status(200).json(book);
   } else {
     // If the book is not found, return a 300 status code with a message
     return res.status(300).json({message: "Book not found"});
   }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  // Retrieve the author from the request parameters
  const author = req.params.author;
  
  // Obtain all the keys for the books object
  const bookKeys = Object.keys(books);
  
  // Initialize an array to hold books by the specified author
  const booksByAuthor = [];
  
  // Iterate through the books object and check if the author matches
  bookKeys.forEach(key => {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  });
  
  // If matching books are found, return them with a status code of 200
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
  return res.status(300).json({message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // Retrieve the title from the request parameters
  const title = req.params.title;
  
  // Obtain all the keys for the books object
  const bookKeys = Object.keys(books);
  
  // Initialize an array to hold books with the specified title
  const booksByTitle = [];
  
  // Iterate through the books object and check if the title matches
  bookKeys.forEach(key => {
    if (books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  });
  
  // If matching books are found, return them with a status code of 200
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
  return res.status(300).json({message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  // Find the book in the books object using the ISBN
 const book = books[isbn];
 
 // If the book is found
 if (book) {  
   return res.status(200).json({ Reviews: book.reviews});
 } else {
   return res.status(300).json({ message: "Book not found" });
 }

});

module.exports.general = public_users;
