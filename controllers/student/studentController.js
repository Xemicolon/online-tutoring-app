const ash = require("express-async-handler");
const Tutor = require("../../models/Tutor");
const Lesson = require("../../models/Lesson");
const Student = require("../../models/Student");
require("../../middleware/auth");

exports.studentBookLesson = ash(async (req, res, next) => {
  const { tutor_name, student_name } = req.body;
  if (!tutor_name || !student_name) {
    res.status(401).send({
      message: `Student and/or Tutor field cannot be empty`,
    });
  }

  Tutor.findOne({ first_name: tutor_name })
    .then((tutor) => {
      Student.findOne({ first_name: student_name })
        .then((student) => {
          const newLesson = new Lesson({
            student: student._id,
            tutor: tutor._id,
          });
          newLesson.save();
          Lesson.find({})
            .populate("student")
            .populate("tutor")
            .exec((err, result) => {
              res.status(200).send({
                message: `Lesson booked`,
                result: newLesson,
              });
            });
        })
        .catch((err) => {
          res.status(404).send({
            message: "Student not found",
            success: false,
            status: 404,
          });
        });
    })
    .catch((err) => {
      res.status(404).send({
        message: "Tutor not found",
        success: false,
        status: 404,
      });
    });
});
