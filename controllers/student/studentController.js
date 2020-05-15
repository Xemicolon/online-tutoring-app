const ash = require("express-async-handler");
const User = require("../../models/User");
const Lesson = require("../../models/Lesson");
const Category = require("../../models/Category");
const Subject = require("../../models/Subject");
require("../../middleware/auth");

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
  if (
    !(
      categoryName === "primary" ||
      categoryName === "jss" ||
      categoryName === "sss"
    )
  ) {
    return next(
      res.send({
        status: 400,
        message: `This category ${categoryName} cannot be found`,
      })
    );
  }
  if (!subject) {
    return next(
      res.send({
        status: 404,
        message: `Subject doesn't exist or is not in this category!`,
      })
    );
  }

  if (!tutor) {
    return next(
      res.send({
        status: 404,
        message: `Tutor doesn't exist!`,
      })
    );
  }

  if (!student) {
    return next(
      res.send({
        status: 404,
        message: `Student doesn't exist!`,
      })
    );
  }

  const tutorTakesSubject = tutor.subjects.filter((sub) =>
    //  sub._id.equals(subject._id)
    console.log(sub._id.equals(subject._id))
  );

  const newLesson = await Lesson.create({
    student: student.email,
    tutor: tutor.email,
    booked_by: "Student",
  });

  await Lesson.find({})
    .populate("student")
    .populate("tutor")
    .populate("booked_by")
    .exec();

  res.status(200).send({
    message: `Lesson booked`,
    result: newLesson,
  });
});
