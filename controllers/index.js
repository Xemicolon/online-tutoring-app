const ash = require("express-async-handler");

exports.index = ash(async (req, res, next) => {
  res.send("Hello world!");
});
