const { validateCategory, Category } = require("../models/category");
var validateId = require("uuid-validate");
const express = require("express");
const router = express.Router();

router.put("/", async (req, res) => {
  const { error } = validateCategory(req.body);
  if (error)
    return res
      .status(400)
      .send({ status: "Error", response: error.details[0].message });

  const { errorExists } = await Category.duplicate(req.body);

  if (errorExists)
    return res.status(400).send({ status: "Error", response: errorExists });

  let category = new Category(req.body);
  await Category.save();
  res.send({ status: "Success", response: category });
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

  const categories = await Category.find(req.body.filter, undefined, options);
  res.send({ status: "Success", response: categories });
});

router.put("/:id", async (req, res) => {
  if (!validateId(req.params.id))
    return res.status(400).send({ status: "Error", response: "Invalid ID" });

  const { error } = validateCategory(req.body);
  if (error)
    return res
      .status(400)
      .send({ status: "Error", response: error.details[0].message });

  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!category)
    return res
      .status(404)
      .send({ status: "Error", response: "No category with that ID exists" });

  res.send({ status: "Success", response: category });
});

router.delete("/:id", async (req, res) => {
  if (!validateId(req.params.id))
    return res.status(400).send({ status: "Error", response: "Invalid ID" });

  const { error } = await Category.findByIdAndRemove(req.params.id);
  if (error) {
    return res.status(400).send({ status: "Error", response: error });
  }
  res.send({ status: "Success", response: "Category removed" });
});

module.exports = router;
