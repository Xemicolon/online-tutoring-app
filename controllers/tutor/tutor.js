const ash = require("express-async-handler");
const Tutor = require("../../models/Tutor");
const Subject = require("../../models/Subject");
require("../../middleware/auth");

// @desc      Put register tutor to take a subject
// @route     PUT /api/v1/category/:catId/subject/:subId/register
// @access    Private/Admin Tutor
exports.tutorRegisterSubject = ash(async (req, res, next) => {
  const subject = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { subjects: req.params.subId },
    },
    { new: true, runValidators: true }
  ).populate("subjects");

  res.status(200).json({ success: true, data: subject });
});

// @desc      Get all subjects tutor takes
// @route     GET /api/v1/users/tutors/subjects
// @access    Private/Tutor
exports.getAllTutorSubjects = ash(async (req, res, next) => {
  const subjectss = await User.find({ _id: req.user._id })
    .populate("subjects")
    .select("subjects");

  res.status(200).json({ success: true, data: subjectss[0].subjects });
});

// @desc      Put Delete registered subject tutor
// @route     PUT /api/v1/category/:catId/subject/:subId/delete
// @access    Private/Tutor
exports.deleteRegisteredSubject = ash(async (req, res, next) => {
  const subjects = await Subject.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { subjects: req.params.subId },
    },
    { new: true }
  );

  res.status(200).json({ success: true, data: subjects });
});
