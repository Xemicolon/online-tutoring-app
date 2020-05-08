const ash = require("express-async-handler");
const Category = require("../../models/Category");
const Subject = require("../../models/Subject");
const Tutor = require("../../models/Tutor");
const Lesson = require("../../models/Lesson");
const Student = require("../../models/Student");
require("../../middleware/auth");

exports.addCategory = ash(async (req, res, next) => {
  const { name } = req.body;
  if (name.toLowerCase() != "jss" && name != "sss" && name != "primary") {
    return res.status(404).send({
      message: "Category name must be primary, jss or sss",
    });
  }
  try {
    const category = await Category.findOne({ name });
    if (category) {
      res.status(404).send({
        status: false,
        message: `Category - ${category.name} exists`,
      });
      return;
    }
    const newCat = await Category.create({ name });
    res.status(200).send({
      status: true,
      message: `New category - ${newCat.name} added`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

exports.updateCategory = ash(async (req, res, next) => {
  try {
    const { name, catId } = req.body;
    if (!name || !catId) {
      res.status(404).send({
        status: false,
        message: `Name or category cannot blank`,
      });
    }
    const previousCategory = await Category.findById(catId);
    const updatedCategory = {
      name: name,
    };
    if (!name) {
      res.status(400).send({
        error_message: `Name of category cannot be blank!`,
      });
    }

    if (previousCategory) {
      await Category.findByIdAndUpdate(catId, updatedCategory);
      res.status(200).send({
        status: true,
        previousCategoryName: {
          name: previousCategory.name,
          description: previousCategory.description,
        },
        updatedCategory: updatedCategory,
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

exports.deleteCategory = ash(async (req, res, next) => {
  try {
    if (!req.body.catId) {
      res.status(404).send(`Category Id (catId) cannot be blank`);
    }
    const category = await Category.findById(req.body.catId);
    if (!category) {
      res.status(404).send({
        message: `Category not found or doesn't exist`,
      });
    }
    await Category.findByIdAndDelete(req.body.catId);
    res.status(200).send({
      status: true,
      catgeory: {},
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

exports.addSubject = ash(async (req, res, next) => {
  const { subName, catId } = req.body;
  const subject = await Subject.findOne({ name: subName });
  const cat = await Category.findOne({ _id: catId });

  try {
    if (!subName || !catId) {
      res.status(404).send(`Subject name or category id cannot be empty`);
      return;
    }
    const newSub = {
      name: subName,
      category: catId,
    };
    const newSubject = new Subject(newSub);
    newSubject.save();
    await Category.findOneAndUpdate(
      { _id: catId },
      { $push: { subjects: newSubject._id } },
      { new: true, useFindAndModify: false }
    );

    res.status(200).send({
      status: true,
      message: `Subject created successfully`,
      new_subject_name: newSubject.name,
      new_subject_category: newSubject.category,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

exports.updateSubjectById = ash(async (req, res, next) => {
  const { subId, subName } = req.body;
  const subject = await Subject.findById(subId);
  if (!subject) {
    res.status(404).send({
      status: false,
      message: `Subject not found or doesn't exist`,
    });
    return;
  }
  const updatedSubject = await Subject.findOneAndUpdate(
    { _id: subId },
    {
      name: subName,
    }
  );
  res.status(200).send({
    status: true,
    message: `Subject name - ${subject.name} has been updated to ${subName}`,
  });
});

exports.deleteSubjectById = ash(async (req, res, next) => {
  const { subId, catId } = req.body;
  const subject = await Subject.find;
  if (!subId || !catId) {
    res.send(`Subject Id or Category Id cannot be empty`);
  }
  Subject.findByIdAndDelete({ _id: subId });
  const caty = await Category.update(
    { _id: catId },
    { $pull: { subjects: subId } }
  );
  res.status(200).json({
    data: {},
    message: "Subject deleted successfully",
  });
});

exports.getAllTutors = ash(async (req, res, next) => {
  const tutors = await Tutor.find({});
  res.status(200).send({
    all_tutors: tutors,
  });
});

exports.getTutorById = ash(async (req, res, next) => {
  const { tutorId } = req.body;
  if (!tutorId) {
    res.send(`Tutor ID field cannot be empty`);
    return;
  }
  const tutor = await Tutor.findOne({ _id: tutorId });
  console.log(tutor);
  if (!tutor) {
    res.send(`Tutor doesn't exist or ID is invalid`);
    return;
  }
  res.status(200).send({
    tutor_details: tutor,
  });
});

exports.deactivateTutorById = ash(async (req, res, next) => {
  const { tutorId } = req.body;
  const tutor = await Tutor.findOne({ _id: tutorId });
  if (tutor.role != true) {
    res.send(`This tutor is deactivated. Contact admin`);
    return;
  }
  const deactivated = await Tutor.findByIdAndUpdate(
    { _id: tutorId, role: "tutor" },
    { isActive: false },
    { new: true, runValidators: true }
  );
  res.status(200).send({
    message: `Tutor has been successfully deactivated`,
    deacitcated_tutor: deactivated,
  });
});

exports.bookLesson = ash(async (req, res, next) => {
  const { tutor_name, student_name } = req.body;
  if (!tutor_name || !student_name) {
    res.status(401).send({
      message: `Tutor and/or Student field cannot be empty`,
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

exports.retrieveLessons = ash(async (req, res, next) => {
  const lessons = await Lesson.find({});
  if (!lessons) {
    res.send("No lessons found");
    return;
  }
  res.status(200).send({
    lessons: lessons,
  });
});

exports.getLessonById = ash(async (req, res, next) => {
  const { lessonId } = req.body;
  const lesson = await Lesson.findOne({ _id: lessonId });
  if (!lessonId) {
    res.status(400).send({
      message: `Lesson Id cannot be blank`,
    });
    return;
  }
  if (!lesson) {
    res.status(400).send({
      message: `Lesson doesn't exist`,
    });
    return;
  }
  res.status(200).send({
    message: `Lesson found`,
    lesson_details: lesson,
  });
});

exports.updateLessonById = ash(async (req, res, next) => {
  try {
    const { student_name, tutor_name, lessonId } = req.body;
    const student = await Student.findOne({ first_name: student_name });
    const tutor = await Tutor.findOne({ first_name: tutor_name });
    const previousLesson = await Lesson.findOne({ _id: lessonId });

    const fieldToUpdate = {
      student: student,
      tutor: tutor,
    };

    const lesson = await Lesson.findByIdAndUpdate(lessonId, fieldToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).send({
      previous_details: previousLesson,
      updated_details: lesson,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

exports.deleteLessonById = ash(async (req, res, next) => {
  const { lessonId } = req.body;
  const lesson = await Lesson.findOne({ _id: lessonId });
  if (!lesson) {
    res.status(400).send({
      message: `Lesson doesn't exist`,
    });
    return;
  }
  if (await Lesson.findOneAndDelete({ _id: lessonId })) {
    res.status(200).send({
      message: `Lesson deleted`,
    });
    return;
  }
  const deleted = await Lesson.findOne({ _id: lessonId });
  if (!deleted) {
    res.status(400).send({
      message: `Lesson doesn't exist`,
    });
    return;
  }
});

// @desc      Search tutor by first name
// @route     POST /api/v1/tutors?name=name
// @access    Private/Admin
exports.getTutorByFirstName = ash(async (req, res, next) => {
  const { first_name } = req.body;
  if (!first_name) {
    res.status(400).send({
      message: `First Name of Tutor cannot be blank`,
    });
  }

  await Tutor.find({ first_name: first_name })
    // .collation({ locale: "en", strength: 2 })
    .sort({ first_name: 1 })
    .then((user) => {
      res.status(200).send({
        result: user,
      });
    });
});


