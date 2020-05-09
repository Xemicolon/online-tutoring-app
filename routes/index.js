const router = require("express").Router()

router.get("/", (req, res) => {
  res.send("Hello and welcome!");
});

module.exports = router