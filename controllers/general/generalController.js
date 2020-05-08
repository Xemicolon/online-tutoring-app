const ash = require("express-async-handler");
const Category = require("../../models/Category");
const Subject = require("../../models/Subject");
require("../../middleware/auth");

exports.getAllSubjects = ash(async (req, res, next) => {
  const { catName } = req.body;
  if (!catName) return res.send("Category name cannot be empty");
  catName.toLowerCase();
  const category = await Category.findOne({ name: catName });
  //
  if (category.subjects.length == 0) {
    res.status(200).send({
      catgeory_name: catName.toUpperCase(),
      subjects: `No subjects found`,
    });
    return;
  }
  res.status(200).send({
    category_name: catName.toUpperCase(),
    subjects: category.subjects,
  });
});

exports.getSubjectById = ash(async (req, res, next) => {
  const { subName, catId } = req.body;
  const category = await Category.findOne({ _id: catId });

  if (!category) {
    res.send(`Category not found or doesn't exist`);
    return;
  }
  //   const foundSubject = await Category.findOne({ subjects });
  for (subje of category.subjects) {
    if (subje == subName) {
      res.send({
        status: true,
        message: `Subject found`,
        subject_name: subName,
        category_name: category.name,
        category_id: category._id,
      });
      return;
    }
    res.status(400).send({
      status: false,
      message: `Subject doesn't exist in this category`,
      category_name: category.name,
      category_id: category._id,
    });
  }
});

exports.showCategories = ash(async (req, res, next) => {
  try {
    const categories = await Category.find({});
    if (!categories) {
      res.status(404).send(`No categories found`);
    }

    await Category.find({})
      .populate("subjects")
      .exec((err, result) =>
        res.send({
          categories: result,
        })
      );
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

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

exports.getSubjectByName = ash(async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).send({
      message: `Name of subject cannot be blank`,
    });
  }

  await Subject.find({})
    .collation({ locale: "en", strength: 2 })
    .sort({ name: 1 })
    .then((subject) => {
      res.status(200).send({
        result: subject,
      });
    });
});
