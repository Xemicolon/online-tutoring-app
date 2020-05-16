const ash = require("express-async-handler");
const Category = require("../../models/Category");
const Subject = require("../../models/Subject");
require("../../middleware/auth");

exports.getAllSubjects = ash(async (req, res, next) => {
  const { catId } = req.params;
  const subjects = await Subject.find({ category: catId });

  if (subjects.length === 0) {
    res.status(400).send({
      status: 400,
      message: `No subjects in this category at the moment!`,
    });
    return;
  }

  res.status(200).send({
    status: 200,
    subjects: subjects,
  });
});

exports.getSubjectById = ash(async (req, res, next) => {
  const { subId, catId } = req.params;
  const subject = await Subject.findOne({ _id: subId, category: catId });
  if (!subject) {
    res.status(400).send({
      status: 400,
      message: `Subject doesn't exist in this category`,
    });
  }
  res.status(200).send({
    status: 200,
    message: `Subject found`,
    subject_name: `${subject.name}`,
    subject_category: `${subject.category}`,
  });
});

exports.showCategories = ash(async (req, res, next) => {
  try {
    const categories = await Category.find({});
    if (!categories) {
      res.status(404).send({
        status: 400,
        message: `No categories found`,
      });
    }

    await Category.find({})
      .populate("subjects")
      .exec((err, result) =>
        res.status(200).send({
          categories: result,
        })
      );
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

exports.getSubjectsByName = ash(async (req, res, next) => {
  const { name } = req.query;
  if (!name) {
    res.status(400).send({
      success: false,
      message: `Name of subject cannot be blank`,
    });
  }
  const subject = await Subject.find({ name: name }).sort({
    name: 1,
  });

  res.status(200).send({ success: true, subjects: subject });
});
