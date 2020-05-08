const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Welcome to my page");
});

module.exports = router;
