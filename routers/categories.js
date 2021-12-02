const mongoose = require("mongoose");
const Joi = require("joi");

const express = require("express");
const router = express.Router();

const { Category, validate } = require("../models/Category");
const validateId = require("../middleware/validateId");

router.get("/", async (req, res) => {
  const categories = await Category.find().populate("parent_id").limit(10);
  return res.status(200).send(categories);
});

router.post("/", async (req, res) => {
  const { error, value } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = new Category(value);
  await category.save();

  return res.status(201).send(category);
});

router.put("/:id", [validateId], async (req, res) => {
  const { error } = validateForPut(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.parent_id) {
    if (!isValidParentId(req.body.parent_id))
      return res.status(400).send("not valid parent id!");
    if (req.body.parent_id === req.params.id)
      return res.status(400).send("Element and parent can't be same!");
    const parent = await Category.findById(req.body.parent_id);
    if (!parent) return res.status(400).send("parent not found!");
  }

  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) return res.status(404).send("category Not found!");

  return res.status(200).send(category);
});

function isValidParentId(id) {
  return mongoose.isValidObjectId(id);
}

router.delete("/:id", async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id });
  if (!category) return res.status(404).send("already deleted!");

  await category.remove();
  return res.status(200).send(category);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id });
  if (!category) return res.status(404).send("not found!");

  return res.status(200).send(category);
});

const validateForPut = (category) => {
  const statusEnum = ["New", "Used"];

  const schema = Joi.object({
    name: Joi.string().min(3),
    is_parent: Joi.boolean(),
    parent_id: Joi.objectId(),
    is_popular: Joi.boolean(),
    status: Joi.string().valid(...statusEnum),
  });

  return schema.validate(category);
};

module.exports = router;
