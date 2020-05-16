const router = require("express").Router();
const { authorizeRole, verifyToken } = require("../middleware/auth");
const { check } = require("express-validator");
const validate = require("../middleware/validate");
const {
  tutorRegisterSubject,
  getRegisteredSubjects,
  deleteRegisteredSubject,
  makeTutorAdmin,
  makeAdminTutor,
} = require("../controllers/tutor/tutor");

router.put(
  "/categories/:catId/subjects/:subId/register",
  verifyToken,
  validate,
  authorizeRole("tutor"),
  tutorRegisterSubject
);

router.get(
  "/category/tutor/subjects",
  verifyToken,
  validate,
  authorizeRole("tutor"),
  getRegisteredSubjects
);

router.delete(
  "/category/tutor/subjects/:subId",
  verifyToken,
  validate,
  authorizeRole("tutor"),
  deleteRegisteredSubject
);

router.put(
  "/:tutorId/admin",
  authorizeRole("admin"),
  verifyToken,
  validate,
  makeTutorAdmin
);

router.put(
  "/:userId/tutor",
  authorizeRole("admin"),
  verifyToken,
  makeAdminTutor
);

module.exports = router;
