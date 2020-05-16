const router = require("express").Router();
const { authorizeRole, verifyToken } = require("../middleware/auth");
const { check } = require("express-validator");
const validate = require("../middleware/validate");

router.get("/categories", verifyToken, validate, showCategories);
router.get(
  "/:catId/:subId",
  verifyToken,
  [
    check("subId")
      .not()
      .isEmpty()
      .withMessage("Subject Id field cannot be blank"),
    check("catId")
      .not()
      .isEmpty()
      .withMessage("Category Id field cannot be blank"),
  ],
  validate,
  getSubjectById
);
router.get(
  "/categories/:catId/subjects",

  validate,
  [check("catId").not().isEmpty().withMessage("Category Id cannot be empty")],
  verifyToken,
  getAllSubjects
);
router.get("/subject", validate, verifyToken, getSubjectsByName);

router.get(
  "/tutor",
  validate,
  [
    check("firstName")
      .not()
      .isEmpty()
      .withMessage("First Name of Tutor cannot be blank"),
  ],
  verifyToken,
  getTutorByFirstName
);

module.exports = router;
