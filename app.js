require("express-async-errors");
const categories = require("./routes/categories");
const authors = require("./routes/authors");
const books = require("./routes/books");
const error = require("./middleware/error");
const express = require("express");
const app = express();

app.use(express.json());
app.use("/api/categories", categories);
app.use("/api/authors", authors);
app.use("/api/books", books);

app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports.app = app;
