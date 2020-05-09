const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth/auth-admin");
const { authorizeRole, verifyToken } = require("../middleware/auth");
const { check } = require("express-validator");
const validate = require("../middleware/validate");


router.post(
  "/auth/admin/login",
  [
    check("email").isEmail().withMessage("Enter a valid email address"),
    check("password").not().isEmpty().withMessage("Password cannot be blank"),
  ],
  validate,
  login
);

module.exports = router;
