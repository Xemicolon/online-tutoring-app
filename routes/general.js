const router = require("express").Router();
const { verifyToken } = require("../middleware/auth");
const { check } = require("express-validator");
const validate = require("../middleware/validate");
const {
  getTutorByFirstName,
} = require("../controllers/general/generalController");
const {
  showCategories,
  getAllSubjects,
  getSubjectsByName,
  getSubjectById,
} = require("../controllers/general/generalController");

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
  "tutors/tutor",
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
