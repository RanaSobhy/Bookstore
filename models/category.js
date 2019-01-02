const Joi = require("joi");
const { readFile, writeFile } = require("../handlers/file");
const { Book } = require("./book");
const _ = require("lodash");
const uuidv4 = require("uuid/v4");

class Category {
  constructor(category) {
    category.id = uuidv4();
    this.category = category;
    Category.toAdd.push(category);
    return category;
  }

  static async find(filter, projection, options) {
    const content = await readFile();
    let categories = content["categories"];
    if (filter) {
      categories = _.filter(categories, filter);
    }

    if (projection) {
      const path = projection.split(" ");
      categories = _.map(categories, c => _.pick(c, path));
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
        categories = _.orderBy(categories, sortBy, order);
      }

      if (!options.skip) {
        options.skip = 0;
      }
      if (!options.limit) {
        options.limit = categories.length;
      }

      if (options.skip < 0) {
        options.skip = 0;
      }

      if (options.skip >= categories.length) {
        options.skip =
          (Math.ceil(categories.length / parseInt(options.limit)) - 1) *
          parseInt(options.limit);
      }

      categories = categories.slice(
        options.skip,
        parseInt(options.skip) + parseInt(options.limit)
      );
    }

    return categories;
  }
  static async findById(id) {
    const allCategories = await this.find();
    const category = _.find(allCategories, c => c.id === id);
    return category;
  }
  static async findByIdAndRemove(id) {
    const categories = await this.find();

    const books = await Book.find({ category: id });

    if (books.length > 0) {
      return { error: "Can't delete due to FK relationship" };
    }

    const newCategories = _.filter(categories, c => c.id !== id);
    await this.updateCategories(newCategories);
    return { error: undefined };
  }
  static async findByIdAndUpdate(id, newCategory) {
    const categories = await this.find();
    const category = _.find(categories, c => c.id === id);
    if (category) {
      category.name = newCategory.name || category.name;
    }

    await this.updateCategories(categories);
    return category;
  }
  static async updateCategories(newCategories) {
    const content = await readFile();
    content["categories"] = newCategories;
    const status = await writeFile(content);
  }
  static async save() {
    let content = await readFile();
    let categories = content["categories"];
    categories = categories.concat(Category.toAdd);
    await this.updateCategories(categories);
    Category.toAdd = [];
  }

  static async duplicate(category) {
    const categories = await this.find({ name: category.name });
    if (categories.length > 0) {
      return { errorExists: "Category already exists" };
    }
    return { errorExists: undefined };
  }
}

Category.toAdd = [];

var validateCategory = category => {
  const schema = {
    name: Joi.string().required()
  };

  return Joi.validate(category, schema);
};

module.exports = {
  validateCategory,
  Category
};
