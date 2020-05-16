const router = require("express").Router();
const { authorizeRole, verifyToken } = require("../middleware/auth");
const { check } = require("express-validator");
const validate = require("../middleware/validate");

// general

// student
const {
  studentBookLesson,
} = require("../controllers/student/studentController");

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

router.get(
  "/tutors",
  validate,
  verifyToken,
  authorizeRole("admin"),
  getAllTutors
);
router.get(
  "/tutors/tutor/:tutorId",
  verifyToken,
  authorizeRole("admin"),
  getTutorById
);
router.post(
  "/tutors/tutor/:tutorId/",
  verifyToken,
  authorizeRole("admin"),
  deactivateTutorById
);
router.post(
  "/lesson",
  [
    check("studentEmail")
      .not()
      .isEmpty()
      .withMessage("Student's email cannot be blank"),
    check("tutorEmail")
      .not()
      .isEmpty()
      .withMessage("Tutor's email cannot be blank"),
    check("categoryName")
      .not()
      .isEmpty()
      .withMessage("Category name cannot be blank"),
    check("subjectName")
      .not()
      .isEmpty()
      .withMessage("Subject name cannot be blank"),
  ],
  validate,
  verifyToken,
  authorizeRole("admin"),
  bookLesson
);
router.post(
  "/student/lesson",
  verifyToken,
  validate,
  authorizeRole("student"),
  studentBookLesson
);
router.get("/lessons", validate, verifyToken, retrieveLessons);
router.get(
  "/lessons/lesson/:lessonId",
  validate,
  verifyToken,
  authorizeRole("admin"),
  getLessonById
);
router.patch(
  "/lesson",
  validate,
  verifyToken,
  authorizeRole("admin"),
  updateLessonById
);
router.delete(
  "/lessons/lesson/:lessonId",
  validate,
  verifyToken,
  authorizeRole("admin"),
  deleteLessonById
);

// Admin routes
router.post(
  "/category",
  [
    check("name").not().isEmpty().withMessage("Category name cannot be blank"),
    check("description")
      .not()
      .isEmpty()
      .withMessage("Description cannot be blank"),
  ],
  validate,
  verifyToken,
  authorizeRole("admin"),
  addCategory
);

router.patch(
  "/category/:catId",
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
  "/category/:catId",
  verifyToken,
  [check("catId").not().isEmpty().withMessage("Category ID is blank")],
  authorizeRole("admin"),
  deleteCategory
);

router.post(
  "/categories/:catId/subject",
  [
    check("name").not().isEmpty().withMessage("Subject name cannot be blank"),
    check("catId").not().isEmpty().withMessage("Category name cannot be blank"),
  ],
  validate,
  verifyToken,
  authorizeRole("admin"),
  addSubject
);

router.patch(
  "/subject/:subId",
  [
    check("name").not().isEmpty().withMessage("Name cannot be blank"),
    check("description")
      .not()
      .isEmpty()
      .withMessage("Description cannot be blank"),
  ],
  verifyToken,
  validate,
  authorizeRole("admin"),
  updateSubjectById
);

router.delete(
  "/categories/:catId/subjects/:subId",
  verifyToken,
  validate,
  authorizeRole("admin"),
  deleteSubjectById
);

module.exports = router;
