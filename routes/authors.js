const { validateAuthor, Author } = require("../models/author");
var validateId = require("uuid-validate");
const express = require("express");
const router = express.Router();

router.put("/", async (req, res) => {
  const { error } = validateAuthor(req.body);
  if (error)
    return res
      .status(400)
      .send({ status: "Error", response: error.details[0].message });

  const author = new Author(req.body);

  await Author.save();
  res.send({ status: "Success", response: author });
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

  const authors = await Author.find(req.body.filter, undefined, options);
  res.send({ status: "Success", response: authors });
});

router.put("/:id", async (req, res) => {
  if (!validateId(req.params.id))
    return res.status(400).send({ status: "Error", response: "Invalid ID" });

  const { error } = validateAuthor(req.body);
  if (error)
    return res
      .status(400)
      .send({ status: "Error", response: error.details[0].message });

  const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!author)
    return res
      .status(404)
      .send({ status: "Error", response: "No Author with that ID exists" });

  res.send({ status: "Success", response: author });
});

router.delete("/:id", async (req, res) => {
  if (!validateId(req.params.id))
    return res.status(400).send({ status: "Error", response: "Invalid ID" });
  const { error } = await Author.findByIdAndRemove(req.params.id);
  if (error) return res.status(400).send({ status: "Error", response: error });

  res.send({ status: "Success", response: "Author removed" });
});

module.exports = router;
