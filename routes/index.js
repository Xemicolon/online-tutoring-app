const router = require("express").Router();
const { index } = require("../controllers/index");

router.get("/", index);

module.exports = router;
