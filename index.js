const express = require("express");
const app = express();

require("./startup/config")();
require("./startup/validation")();
require("./startup/db")();
require("./startup/router")(app);

port = process.env.PORT || 5000;

const server = app.listen(port, () =>
  console.log(
    `${process.env.NAME} - ${process.env.NODE_ENV}:` +
      ` is running on port ${port}.....`
  )
);
module.exports = server;
