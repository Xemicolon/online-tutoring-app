const ash = require("express-async-handler");
const User = require("../../models/User");
const Lesson = require("../../models/Lesson");
const Category = require("../../models/Category");
const Subject = require("../../models/Subject");
require("../../middleware/auth");

// @desc      POST Student can book a lesson
// @route     POST /api/v1/student/lesson
// @access    Private/Student
exports.studentBookLesson = ash(async (req, res, next) => {
  const { tutorEmail, studentEmail } = req.body;
  let { categoryName, subjectName } = req.body;
  const tutor = await User.findOne({ email: tutorEmail });
  const student = await User.findOne({ email: studentEmail });
  const lesson = await Lesson.findOne({
    student: student._id,
    tutor: tutor._id,
  });
  categoryName = categoryName.toLowerCase();
  const category = await Category.findOne({ name: categoryName });
  const subject = await Subject.findOne({
    name: subjectName,
    category: category._id,
  });

  if (lesson) {
    return next(
      res.status(403).send({
        success: false,
        message: `You can't book a lesson twice`,
      })
    );
  }

  if (
    !(
      categoryName === "primary" ||
      categoryName === "jss" ||
      categoryName === "sss"
    )
  ) {
    return next(
      res.status(404).send({
        success: false,
        message: `This category ${categoryName} cannot be found`,
      })
    );
  }
  if (!subject) {
    return next(
      res.status(404).send({
        success: false,
        message: `Subject doesn't exist or is not in this category!`,
      })
    );
  }

  if (!tutor) {
    return next(
      res.status(404).send({
        success: false,
        message: `Tutor doesn't exist!`,
      })
    );
  }

  if (!student) {
    return next(
      res.status(404).send({
        success: false,
        message: `Student doesn't exist!`,
      })
    );
  }

  let newLesson = await new Lesson({
    student: student,
    tutor: tutor,
    category: category,
    booked_by: "Student",
  });
  newLesson.save();

  res.status(200).send({
    success: true,
    message: `Lesson booked`,
  });
});
