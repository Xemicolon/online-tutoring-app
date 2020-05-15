const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const validate = require("../middleware/validate");
const { register, login } = require("../controllers/auth/auth");

router.post(
  "/auth/login",
  [
    check("email").isEmail().withMessage("Enter a valid email address"),
    check("password").not().isEmpty().withMessage("Enter a valid password"),
  ],
  validate,
  login
);

router.post(
  "/auth/register",
  [
    check("firstName")
      .not()
      .isEmpty()
      .withMessage("You first name is required"),
    check("lastName").not().isEmpty().withMessage("You last name is required"),
    check("email").isEmail().withMessage("Enter a valid email address"),
    check("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("Must be at least 6 chars long"),
    check("role").not().isEmpty().withMessage("Role field cannot be blank"),
  ],
  validate,
  register
);

module.exports = router;
 