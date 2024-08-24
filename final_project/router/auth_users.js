const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
 // Filter the users array for any user with the same username
 let userswithsamename = users.filter((user) => {
  return user.username === username;
});
// Return true if any user with the same username is found, otherwise false
if (userswithsamename.length > 0) {
  return true;
} else {
  return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
// Filter the users array for any user with the same username and password
let validusers = users.filter((user) => {
  return (user.username === username && user.password === password);
});
// Return true if any valid user is found, otherwise false
if (validusers.length > 0) {
  return true;
} else {
  return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;

  if (!isbn || !review) {
      return res.status(400).json({ message: "ISBN and review are required" });
  }
 
 // Check if the user is logged in
 if (!req.session.authorization) {
   return res.status(403).json({ message: "User not logged in" });
 }

 // Find the book in the books object using the ISBN
 const book = books[isbn];
 
 // If the book is found
 if (book) {
   // Check if the user has already posted a review
   if (book.reviews[username]) {
     // Update the existing review
     book.reviews[username] = review;
   } else {
     // Add a new review
     book.reviews[username] = review;
   }
   return res.status(200).json({ message: "Review added/modified successfully" });
 } else {
   return res.status(300).json({ message: "Book not found" });
 }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }

  // Check if the user is logged in
  if (!req.session.authorization) {
  return res.status(403).json({ message: "User not logged in" });
  }

  // Check if the ISBN exists in the books object
  if (books[isbn]) {
    const bookReviews = books[isbn].reviews;
    if (bookReviews && bookReviews[username]) {
      const review = bookReviews[username];
        delete bookReviews[username];
        return res.status(200).json({ message: "Review successfully deleted \n Deleted review: " + review });
    } else {
        return res.status(404).json({ message: "No review found for this user" });
    }
} else {
    return res.status(404).json({ message: "Book not found" });
}

})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
