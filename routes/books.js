const { validateBook, Book } = require("../models/book");
const { Category } = require("../models/category");
const { Author } = require("../models/author");
var validateId = require("uuid-validate");
const express = require("express");
const router = express.Router();

router.put("/", async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) {
    return res
      .status(400)
      .send({ status: "Error", response: error.details[0].message });
  }
  if (!validateId(req.body.category)) {
    return res
      .status(400)
      .send({ status: "Error", response: "Invalid category ID" });
  }

  if (!validateId(req.body.author)) {
    return res
      .status(400)
      .send({ status: "Error", response: "Invalid author ID" });
  }
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res
      .status(404)
      .send({ status: "Error", response: "Category doesn't exist" });
  }
  const author = await Author.findById(req.body.author);
  if (!author) {
    return res
      .status(404)
      .send({ status: "Error", response: "Author doesn't exist" });
  }
  const book = new Book(req.body);

  await Book.save();
  res.send({ status: "Success", response: book });
});

router.post("/", async (req, res) => {
  const options = {
    sort: req.body.sort
  };

  if (req.body.page) {
    options.limit = req.body.limit || 10;
    options.skip = (req.body.page - 1) * options.limit;

    if (options.limit < 0) {
      options.limit = 10;
      options.skip = (req.body.page - 1) * options.limit;
    }
  }

  const books = await Book.find(req.body.filter, undefined, options);
  res.send({ status: "Success", response: books });
});

router.put("/:id", async (req, res) => {
  if (!validateId(req.params.id))
    return res.status(400).send({ status: "Error", response: "Invalid ID" });

  const { error } = validateBook(req.body);
  if (error)
    return res
      .status(400)
      .send({ status: "Error", response: error.details[0].message });

  if (!validateId(req.body.category)) {
    return res
      .status(400)
      .send({ status: "Error", response: "Invalid category ID" });
  }

  if (!validateId(req.body.author)) {
    return res
      .status(400)
      .send({ status: "Error", response: "Invalid author ID" });
  }
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res
      .status(404)
      .send({ status: "Error", response: "Category doesn't exist" });
  }
  const author = await Author.findById(req.body.author);
  if (!author) {
    return res
      .status(404)
      .send({ status: "Error", response: "Author doesn't exist" });
  }

  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!book)
    return res
      .status(404)
      .send({ status: "Error", response: "no book with that id exists" });

  res.send({ status: "Success", response: book });
});

router.delete("/:id", async (req, res) => {
  if (!validateId(req.params.id))
    return res.status(400).send({ status: "Error", response: "Invalid ID" });
  const book = await Book.findByIdAndRemove(req.params.id);
  res.send({ status: "Success", response: "Book removed" });
});

module.exports = router;
