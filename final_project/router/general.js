const express = require("express");
const axios = require("axios");

const getBooksAxios = async () => {
  const response = await axios.get("http://localhost:5000/");
  return response.data;
};

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();
const BASE_URL = "http://localhost:5000";

// --------------------
// Task 6: Register User
// --------------------
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered" });
});

// ----------------------------------------------------
// Task 10: Get all books (async/await + Axios)
// ----------------------------------------------------
public_users.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// ----------------------------------------------------
// Task 11: Get book by ISBN (async/await + Axios)
// ----------------------------------------------------
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`${BASE_URL}/`);
    const book = response.data[isbn];

    if (book) {
      return res.status(200).json(book);
    }
    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book by ISBN" });
  }
});

// ----------------------------------------------------
// Task 12: Get books by Author (async/await + Axios)
// ----------------------------------------------------
public_users.get("/author/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`${BASE_URL}/`);
    const booksData = response.data;

    const results = Object.keys(booksData)
      .filter(isbn => booksData[isbn].author === author)
      .map(isbn => ({ isbn, ...booksData[isbn] }));

    if (results.length > 0) {
      return res.status(200).json(results);
    }
    return res.status(404).json({ message: "No books found for the given author" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// ----------------------------------------------------
// Task 13: Get books by Title (async/await + Axios)
// ----------------------------------------------------
public_users.get("/title/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`${BASE_URL}/`);
    const booksData = response.data;

    const results = Object.keys(booksData)
      .filter(isbn => booksData[isbn].title === title)
      .map(isbn => ({ isbn, ...booksData[isbn] }));

    if (results.length > 0) {
      return res.status(200).json(results);
    }
    return res.status(404).json({ message: "No books found for the given title" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

// -----------------------------
// Task 5: Get book reviews
// -----------------------------
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
