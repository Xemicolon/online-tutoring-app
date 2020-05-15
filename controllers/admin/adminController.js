const ash = require("express-async-handler");
const Category = require("../../models/Category");
const Subject = require("../../models/Subject");
const Lesson = require("../../models/Lesson");
const User = require("../../models/User");
require("../../middleware/auth");

exports.addCategory = ash(async (req, res, next) => {
  const { name, description } = req.body;
  if (!(await User.findOne({ role: req.user.role }))) {
    res.send("ok");
  }

  if (
    name.toLowerCase() != "jss" &&
    name.toLowerCase() != "sss" &&
    name.toLowerCase() != "primary"
  ) {
    return res.status(400).send({
      status: 400,
      message: "Category name must be primary, jss or sss",
    });
  }
  try {
    const category = await Category.findOne({ name });
    if (category) {
      res.status(400).json({
        status: 400,
        message: `Category - ${category.name} exists`,
      });
      return;
    }
    const newCat = await Category.create({ name, description });
    res.status(200).json({
      status: 200,
      message: `New category - ${newCat.name} added`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: 500, message: err.message });
  }
});

exports.updateCategory = ash(async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const previousCategory = await Category.findById(req.params.catId);
    const updatedCategory = {
      name: name,
      description: description,
    };

    if (previousCategory) {
      await Category.findByIdAndUpdate(req.params.catId, updatedCategory);
      res.status(200).send({
        status: 200,
        previousCategoryName: {
          name: previousCategory.name,
          description: previousCategory.description,
        },
        updatedCategory: updatedCategory,
      });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
});

exports.deleteCategory = ash(async (req, res, next) => {
  try {
    const { catId } = req.params;

    const category = await Category.findById(catId);
    if (!category) {
      res.status(404).json({
        status: 404,
        message: `Category not found or doesn't exist`,
      });
    }
    await Category.findByIdAndDelete(catId);
    res.status(200).send({
      status: 200,
      message: "Category has been deleted",
      catgeory: {},
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
});

exports.addSubject = ash(async (req, res, next) => {
  const { name } = req.body;
  const subject = await Subject.findOne({ name });
  const cat = await Category.findOne({ _id: req.params.catId });
  if (!cat) {
    return next(
      res.status(404).send({
        status: 404,
        message: `Category not found`,
      })
    );
  }
  try {
    let subj = await Subject.find({ category: cat._id });
    for (suby of subj) {
      let a = { id: suby.category };
      let b = { id: cat._id };
      a = JSON.stringify(a);
      b = JSON.stringify(b);
      if (suby.name.toLowerCase() === name.toLowerCase() || a !== b) {
        res.status(403).send({
          status: 403,
          message: `You cannot add the same subject twice in a category!`,
        });
        return;
      }
    }
    const newSub = {
      name: name,
      category: req.params.catId,
    };
    const newSubject = new Subject(newSub);
    newSubject.save();

    await Category.findOneAndUpdate(
      { _id: req.params.catId },
      { $push: { subjects: newSubject._id } },
      { new: true, useFindAndModify: false }
    );

    res.status(200).send({
      status: 200,
      message: `Subject created successfully`,
      new_subject_name: newSubject.name,
      new_subject_category: newSubject.category,
    });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
});

exports.updateSubjectById = ash(async (req, res, next) => {
  const { name } = req.body;
  const subject = await Subject.findById(req.params.subId);
  if (!subject) {
    res.status(404).send({
      status: 404,
      message: `Subject not found or doesn't exist`,
    });
    return;
  }
  const updatedSubject = await Subject.findOneAndUpdate(
    { _id: req.params.subId },
    {
      name: name,
    }
  );
  res.status(200).send({
    status: 200,
    message: `${subject.name} has been updated to ${name}`,
  });
});

exports.deleteSubjectById = ash(async (req, res, next) => {
  const { subId, catId } = req.params;
  const subject = await Subject.findOne({ _id: subId });
  if (!subject) {
    res.status(404).send({
      status: 404,
      message: `Subject doesn't exist`,
    });
  }
  await Subject.findByIdAndDelete({ _id: subId });
  await Category.update({ _id: catId }, { $pull: { subjects: subId } });
  res.status(200).json({
    status: 200,
    message: "Subject deleted successfully",
    subject: {},
  });
});

exports.getAllTutors = ash(async (req, res, next) => {
  const tutors = await User.find({ role: "tutor" });
  res.status(200).send({
    status: 200,
    all_tutors: tutors,
  });
});

exports.getTutorById = ash(async (req, res, next) => {
  const { tutorId } = req.params;
  const tutor = await User.findOne({ _id: tutorId });
  if (!tutor) {
    res.status(404).send({
      status: 404,
      message: `Tutor doesn't exist or ID is invalid`,
    });
    return;
  }
  res.status(200).send({
    status: 200,
    tutor_details: tutor,
  });
});

exports.deactivateTutorById = ash(async (req, res, next) => {
  const { tutorId } = req.params;
  const tutor = await User.findOne({ _id: tutorId });
  if (tutor.isActive != true) {
    res.status(400).send({
      status: 400,
      message: `This tutor has been deactivated. Contact admin`,
    });
    return;
  }
  const deactivated = await User.findByIdAndUpdate(
    { _id: tutorId, role: "tutor" },
    { isActive: false },
    { new: true, runValidators: true }
  );
  res.status(200).send({
    status: 200,
    message: `Tutor has been successfully deactivated`,
    deacitcated_tutor: deactivated,
  });
});

exports.bookLesson = ash(async (req, res, next) => {
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
      res.status(404).send({
        status: 404,
        message: `This category ${categoryName} cannot be found`,
      })
    );
  }
  if (!subject) {
    return next(
      res.status(404).send({
        status: 404,
        message: `Subject doesn't exist or is not in this category!`,
      })
    );
  }

  if (!tutor) {
    return next(
      res.status(404).send({
        status: 404,
        message: `Tutor doesn't exist!`,
      })
    );
  }

  if (!student) {
    return next(
      res.status(404).send({
        status: 404,
        message: `Student doesn't exist!`,
      })
    );
  }

  const tutorTakesSubject = tutor.subjects.filter((sub) =>
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
    status: 200,
    message: `Lesson booked`,
    result: newLesson,
  });
});

exports.retrieveLessons = ash(async (req, res, next) => {
  const lessons = await Lesson.find({});
  if (!lessons) {
    res.status(404).send({
      status: 404,
      message: "No lessons found",
    });
    return;
  }
  res.status(200).send({
    status: 200,
    lessons: lessons,
  });
});

exports.getLessonById = ash(async (req, res, next) => {
  const { lessonId } = req.params;
  const lesson = await Lesson.findOne({ _id: lessonId });

  if (!lesson) {
    res.status(404).send({
      status: 404,
      message: `Lesson doesn't exist`,
    });
    return;
  }
  res.status(200).send({
    status: 200,
    message: `Lesson found`,
    lesson_details: lesson,
  });
});

exports.updateLessonById = ash(async (req, res, next) => {
  try {
    const { student_name, tutor_name, lessonId } = req.body;
    const student = await User.findOne({ firstName: student_name });
    const tutor = await User.findOne({ firstName: tutor_name });
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
      status: 200,
      previous_details: previousLesson,
      updated_details: lesson,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

exports.deleteLessonById = ash(async (req, res, next) => {
  const { lessonId } = req.params;
  const lesson = await Lesson.findOne({ _id: lessonId });
  if (!lesson) {
    res.status(404).send({
      status: 404,
      message: `Lesson doesn't exist`,
    });
    return;
  }
  if (await Lesson.findOneAndDelete({ _id: lessonId })) {
    res.status(200).send({
      status: 200,
      message: `Lesson deleted`,
    });
    return;
  }
  const deleted = await Lesson.findOne({ _id: lessonId });
  if (!deleted) {
    res.status(404).send({
      status: 404,
      message: `Lesson doesn't exist`,
    });
    return;
  }
});

// @desc      Search tutor by first name
// @route     POST /api/v1/tutors?name=name
// @access    Private/Admin
exports.getTutorByFirstName = ash(async (req, res, next) => {
  const { firstName } = req.body;

  const tutor = await User.find({ firstName: firstName, role: "tutor" }).sort({
    firstName: 1,
  });

  if (tutor.length < 1) {
    return res.status(404).send({
      status: 404,
      message: `No user with that First Name found`,
    });
  }
  res.status(200).send({
    status: 200,
    result: tutor,
  });
});
