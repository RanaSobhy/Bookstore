const Joi = require("joi");
const { readFile, writeFile } = require("../handlers/file");
const _ = require("lodash");
const uuidv4 = require("uuid/v4");

class Book {
  constructor(book) {
    book.id = uuidv4();
    this.book = book;
    Book.toAdd.push(book);
    return book;
  }

  static async find(filter, projection, options) {
    const content = await readFile();
    let books = content["books"];
    if (filter) {
      books = _.filter(books, filter);
    }

    if (projection) {
      const path = projection.split(" ");
      books = _.map(books, c => _.pick(c, path));
    }

    if (options) {
      if (options.sort) {
        let sortBy = [];
        let order = [];
        for (const key in options.sort) {
          sortBy.push(key);
          if (options.sort[key] === 1) {
            order.push("asc");
          } else if (options.sort[key] === -1) {
            order.push("desc");
          }
        }
        books = _.orderBy(books, sortBy, order);
      }

      if (!options.skip) {
        options.skip = 0;
      }
      if (!options.limit) {
        options.limit = books.length;
      }

      if (options.skip < 0) {
        options.skip = 0;
      }

      if (options.skip >= books.length) {
        options.skip =
          (Math.ceil(books.length / parseInt(options.limit)) - 1) *
          parseInt(options.limit);
      }

      books = books.slice(
        options.skip,
        parseInt(options.skip) + parseInt(options.limit)
      );
    }

    return books;
  }

  static async findById(id) {
    const allBooks = await this.find();
    const book = _.find(allBooks, c => c.id === id);
    return book;
  }
  static async findByIdAndRemove(id) {
    const books = await this.find();
    //check for FK relationship
    const newBooks = _.filter(books, c => c.id !== id);
    await this.updateBooks(newBooks);
  }
  static async findByIdAndUpdate(id, newBook) {
    const books = await this.find();
    const book = _.find(books, c => c.id === id);
    if (book) {
      book.title = newBook.title || book.title;
      book.author = newBook.author || book.author;
      book.description = newBook.description || book.description;
      book.isbn = newBook.isbn || book.isbn;
      book.publishYear = newBook.publishYear || book.publishYear;
      book.pagesNumber = newBook.pagesNumber || book.pagesNumber;
      book.image = newBook.image || book.image;
      book.book = newBook.book || book.book;
      book.category = newBook.category || book.category;
    }

    await this.updateBooks(books);
    return book;
  }

  static async updateBooks(newBooks) {
    const content = await readFile();
    content["books"] = newBooks;
    const status = await writeFile(content);
  }

  static async save() {
    let content = await readFile();
    let books = content["books"];
    books = books.concat(Book.toAdd);
    await this.updateBooks(books);
    Book.toAdd = [];
  }
}

Book.toAdd = [];
var validateBook = book => {
  const schema = {
    title: Joi.string().required(),
    author: Joi.string().required(),
    description: Joi.string(),
    isbn: Joi.string(),
    publishYear: Joi.number()
      .greater(999)
      .less(10000),
    pagesNumber: Joi.number(),
    image: Joi.string().regex(
      /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/
    ),
    category: Joi.string().required()
  };

  return Joi.validate(book, schema);
};

module.exports = {
  validateBook,
  Book
};
