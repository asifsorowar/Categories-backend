const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  is_parent: {
    type: Boolean,
    required: true,
    default: false,
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false,
    default: null,
  },
  is_popular: {
    type: Boolean,
    required: true,
    default: false,
  },
  status: {
    type: String,
    enum: ["New", "Used"],
    required: true,
    default: "New",
  },
});

categorySchema.pre("remove", async function (next) {
  await this.model("Category").deleteMany({ parent_id: this._id });
  return next();
});

const Category = mongoose.model("Category", categorySchema);

const validate = (category) => {
  const statusEnum = ["New", "Used"];

  const schema = Joi.object({
    name: Joi.string().required().min(3),
    is_parent: Joi.boolean().default(false),
    parent_id: Joi.objectId().default(null),
    is_popular: Joi.boolean().default(false),
    status: Joi.string()
      .required()
      .valid(...statusEnum),
  });

  return schema.validate(category);
};

module.exports.validate = validate;
module.exports.Category = Category;
