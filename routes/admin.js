const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth/auth-admin");
const { authorizeRole, verifyToken } = require("../middleware/auth");
const { check } = require("express-validator");
const validate = require("../middleware/validate");

// router.get("/admin", verifyToken, authorizeRole("admin"));
// router.post(
//   "/auth/admin/register",
//   [
//     check("email").isEmail().withMessage("Enter a valid email address"),
//     check("password")
//       .not()
//       .isEmpty()
//       .isLength({ min: 6 })
//       .withMessage("Must be at least 6 chars long"),
//     check("first_name")
//       .not()
//       .isEmpty()
//       .withMessage("You first name is required"),
//     check("last_name").not().isEmpty().withMessage("You last name is required"),
//   ],
//   validate,
//   register
// );

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
