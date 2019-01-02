const Joi = require("joi");
const { readFile, writeFile } = require("../handlers/file");
const { Book } = require("./book");
const _ = require("lodash");
const uuidv4 = require("uuid/v4");

class Author {
  constructor(author) {
    author.id = uuidv4();
    this.author = author;
    Author.toAdd.push(author);
    return author;
  }

  static async find(filter, projection, options) {
    const content = await readFile();
    let authors = content["authors"];
    if (filter) {
      authors = _.filter(authors, filter);
    }

    if (projection) {
      const path = projection.split(" ");
      authors = _.map(authors, c => _.pick(c, path));
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
        authors = _.orderBy(authors, sortBy, order);
      }

      if (!options.skip) {
        options.skip = 0;
      }
      if (!options.limit) {
        options.limit = authors.length;
      }

      if (options.skip < 0) {
        options.skip = 0;
      }

      if (options.skip >= authors.length) {
        options.skip =
          (Math.ceil(authors.length / parseInt(options.limit)) - 1) *
          parseInt(options.limit);
      }

      authors = authors.slice(
        options.skip,
        parseInt(options.skip) + parseInt(options.limit)
      );
    }

    return authors;
  }

  static async findById(id) {
    const allAuthors = await this.find();
    const author = _.find(allAuthors, c => c.id === id);
    return author;
  }
  static async findByIdAndRemove(id) {
    const authors = await this.find();
    const books = await Book.find({ author: id });

    if (books.length > 0) {
      return { error: "Can't delete due to FK relationship" };
    }
    const newAuthors = _.filter(authors, c => c.id !== id);
    await this.updateAuthors(newAuthors);
    return { error: undefined };
  }
  static async findByIdAndUpdate(id, newAuthor) {
    const authors = await this.find();
    const author = _.find(authors, c => c.id === id);
    if (author) {
      author.name = newAuthor.name || author.name;
      author.jobTitle = newAuthor.jobTitle || author.jobTitle;
      author.bio = newAuthor.bio || author.bio;
    }
    await this.updateAuthors(authors);
    return author;
  }

  static async updateAuthors(newAuthors) {
    const content = await readFile();
    content["authors"] = newAuthors;
    const status = await writeFile(content);
  }

  static async save() {
    let content = await readFile();
    let authors = content["authors"];
    authors = authors.concat(Author.toAdd);
    await this.updateAuthors(authors);
    Author.toAdd = [];
  }

  static async duplicate(author) {
    const authors = await this.find({ name: author.name });
    if (authors.length > 0) {
      return { errorExists: "Author already exists" };
    }
    return { errorExists: undefined };
  }
}

Author.toAdd = [];

var validateAuthor = author => {
  const schema = {
    name: Joi.string().required(),
    jobTitle: Joi.string().required(),
    bio: Joi.string()
  };

  return Joi.validate(author, schema);
};

module.exports = {
  validateAuthor,
  Author
};
