const router = require("express").Router();
const { authorizeRole, verifyToken } = require("../middleware/auth");
const { check } = require("express-validator");
const validate = require("../middleware/validate");

// auth
const student = require("../controllers/auth/auth-student");
const tutor = require("../controllers/auth/auth-tutor");

// general
const {
  showCategories,
  getAllSubjects,
  getSubjectByName,
  getSubjectById,
  getTutorByFirstName,
} = require("../controllers/general/generalController");

// student
const {
  studentBookLesson,
} = require("../controllers/student/studentController");

// tutors
const {
  getAllTutorSubjects,
  tutorRegisterSubject,
  deleteRegisteredSubject,
} = require("../controllers/tutor/tutor");

// admin
const {
  addCategory,
  updateCategory,
  deleteCategory,
  addSubject,
  updateSubjectById,
  deleteSubjectById,
  getAllTutors,
  getTutorById,
  deactivateTutorById,
  bookLesson,
  retrieveLessons,
  getLessonById,
  updateLessonById,
  deleteLessonById,
} = require("../controllers/admin/adminController");

// General routes
router.get("/categories", verifyToken, validate, showCategories);
router.get(
  "/category/subject",
  verifyToken,
  [
    check("subName")
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
router.get("/category/subjects", validate, verifyToken, getAllSubjects);
router.get("/tutor/firstname", verifyToken,verifyToken,  validate, getTutorByFirstName);
router.get("/subject/name", validate,verifyToken,  getSubjectByName);
router.get("/tutors", validate, verifyToken, getAllTutors);
router.post("/tutor", validate, verifyToken, getTutorById);
router.post("/tutor/deactivate", verifyToken, validate, deactivateTutorById);
router.post("/lesson", validate, verifyToken, bookLesson);
router.post("/student/lesson", verifyToken, validate, studentBookLesson);
router.get("/lessons", validate, verifyToken, retrieveLessons);
router.get("/lesson", validate, verifyToken, getLessonById);
router.patch("/lesson", validate, verifyToken, updateLessonById);
router.delete("/lesson", validate, verifyToken, deleteLessonById);

// Student route
router.post(
  "/auth/student/login",
  [
    check("email").isEmail().withMessage("Enter a valid email address"),
    check("password").not().isEmpty().withMessage("Password cannot be blank"),
  ],
  validate,
  student.login
);

router.post(
  "/auth/student/register",
  [
    check("email").isEmail().withMessage("Enter a valid email address"),
    check("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("Must be at least 6 chars long"),
    check("first_name")
      .not()
      .isEmpty()
      .withMessage("You first name is required"),
    check("last_name").not().isEmpty().withMessage("You last name is required"),
  ],
  validate,
  student.register
);

// Tutor routes
router.post(
  "/auth/tutor/login",
  [
    check("email").isEmail().withMessage("Enter a valid email address"),
    check("password").not().isEmpty().withMessage("Password cannot be blank"),
  ],
  validate,
  tutor.login
);
router.post(
  "/auth/tutor/register",
  [
    check("email").isEmail().withMessage("Enter a valid email address"),
    check("password")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("Must be at least 6 chars long"),
    check("first_name")
      .not()
      .isEmpty()
      .withMessage("You first name is required"),
    check("last_name").not().isEmpty().withMessage("You last name is required"),
  ],
  validate,
  tutor.register
);

// Admin routes
router.post(
  "/categories/add",
  [check("name").not().isEmpty().withMessage("Category name cannot be blank")],
  validate,
  verifyToken,
  authorizeRole("admin"),
  addCategory
);

router.patch(
  "/category/update",
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Updated category name cannot be blank"),
    check("catId").not().isEmpty().withMessage("Category ID is blank"),
  ],
  verifyToken,
  authorizeRole("admin"),
  updateCategory
);
router.delete(
  "/category/delete",
  verifyToken,
  [check("catId").not().isEmpty().withMessage("Category ID is blank")],
  authorizeRole("admin"),
  deleteCategory
);

router.post(
  "/subject/add",
  [
    check("subName")
      .not()
      .isEmpty()
      .withMessage("Subject name cannot be blank"),
    check("catId").not().isEmpty().withMessage("Category name cannot be blank"),
  ],
  validate,
  addSubject
);

router.patch(
  "/subject/update",
  [
    check("subName")
      .not()
      .isEmpty()
      .withMessage("Subject name cannot be blank"),
  ],
  verifyToken,
  validate,
  updateSubjectById
);

router.delete("/subject/delete", [
  check("subId").not().isEmpty().withMessage("Subject name cannot be blank"),
  check("catId").not().isEmpty().withMessage("Category name cannot be blank"),
  verifyToken,
  validate,
  deleteSubjectById,
]);

module.exports = router;
