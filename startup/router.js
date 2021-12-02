const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const categories = require("../routers/categories");
const errors = require("../middleware/errors");

module.exports = (app) => {
  app.use(express.json());
  app.use(cors());
  if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

  app.use("/api/categories", categories);
  app.use(errors);
};
