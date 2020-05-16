const ash = require("express-async-handler");
const Subject = require("../../models/Subject");
const Category = require("../../models/Category");
const User = require("../../models/User");
require("../../middleware/auth");

// @desc      Put register tutor to take a subject
// @route     PUT /api/v1/category/:catId/subject/:subId/register
// @access    Private/Admin, Tutor
exports.tutorRegisterSubject = ash(async (req, res, next) => {
  const { subId, catId } = req.params;
  const category = await Category.findById({ _id: catId });
  const subject = await Subject.findById({ _id: subId });

  if (!req.user.role === "tutor") {
    return next(
      res.send({
        status: 400,
        message: `Admin needs to be a tutor to take this subject`,
      })
    );
  }

  if (!category) {
    return next(
      res.send({
        status: 404,
        message: `Category doesn't exist`,
      })
    );
  }
  if (!subject) {
    return next(
      res.send({
        status: 404,
        message: `Subject doesn't exist`,
      })
    );
  }
  for (subje of subject.tutors) {
    if (JSON.stringify(subje) === JSON.stringify(req.user._id)) {
      return next(
        res.send({
          status: 403,
          message: `You have registered to take this subject before`,
        })
      );
    }
  }

  await Subject.findByIdAndUpdate(
    subject._id,
    { $push: { tutors: req.user._id } },
    { new: true, useFindAndModify: false }
  );
  let result = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { subjects: subId } },
    { new: true, useFindAndModify: false }
  );
  res.send({
    status: 200,
    message: `You have successfully registered to take this course`,
    result: result,
  });
});

// @desc      Get all subjects tutor takes
// @route     GET /api/v1/users/tutors/subjects
// @access    Private/Tutor
exports.getAllTutorSubjects = ash(async (req, res, next) => {
  // const subjects = await User.find({ _id: req.user._id });
});

exports.getRegisteredSubjects = ash(async (req, res, next) => {
  const subjects = await Subject.find({ tutors: req.user._id });
  if (!subjects) {
    return next(
      res.send({
        status: 404,
        message: `You haven't registered for any subject`,
      })
    );
  }
  let result = [];
  for (subject of subjects) {
    result.push(subject.name);
  }
  res.send({
    status: 200,
    subjects: result,
  });
});

// @desc      Put Delete registered subject tutor
// @route     PUT /api/v1/category/:catId/subject/:subId/delete
// @access    Private/Tutor
exports.deleteRegisteredSubject = ash(async (req, res, next) => {
  const subject = await Subject.findOne({
    _id: req.params.subId,
    tutors: req.user._id,
  });

  if (!subject) {
    return next(
      res.send({
        status: 404,
        message: `Subject doesn't exist or has been deleted`,
      })
    );
  }
  const user = await User.update(
    { _id: req.user._id },
    { $pull: { subjects: req.params.subId } }
  );
  const result = await Subject.update(
    { _id: req.params.subId },
    { $pull: { tutors: req.user._id } }
  );
  if (!result) {
    res.send({
      status: 404,
      message: `You cannot unregister the subject you did not register`,
    });
  }
  res.send({
    status: 200,
    message: `You have stopped taking this subject`,
  });
});

exports.makeTutorAdmin = ash(async (req, res, next) => {
  let tutor = await User.findOne({ _id: req.params.tutorId, role: "tutor" });
  if (!(tutor && tutor.isActive)) {
    return next(
      res.send({
        status: 404,
        message: `Tutor doesn't exist or is not active`,
      })
    );
  }
  if (tutor.isAdmin === true) {
    return next(
      res.send({
        status: 403,
        message: `Tutor is already an admin`,
      })
    );
  }
  tutor = await User.findOneAndUpdate(
    { _id: req.params.tutorId },
    { isAdmin: true, role: "tutor" },
    { new: true, upsert: true }
  );

  res.send({
    status: 200,
    message: `You have made ${tutor.email} an admin`,
    tutor_admin_status: tutor.isAdmin,
  });
});

exports.makeAdminTutor = ash(async (req, res, next) => {
  const admin = await User.findOne({ _id: req.params.userId, isAdmin: true });

  const adminToTutor = await User.findOneAndUpdate(
    { isAdmin: true },
    { role: "tutor", isAdmin: false },
    { new: true, upsert: true }
  );
  res.send({
    status: 200,
    message: `You have made ${adminToTutor.email} a tutor`,
    admin_role: adminToTutor.role,
  });
});
