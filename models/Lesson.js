const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LessonSchema = new Schema(
  {
    tutor: {
      type: Schema.Types.ObjectId,
      ref: "Tutor",
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  },
  { timestamps: true }
);

LessonSchema.index({ student: 1, tutor: 1 }, { unique: true });

LessonSchema.pre(/^find/, function (next) {
  this.populate({
    path: "student",
    select: "first_name last_name email",
  }).populate({ path: "tutor", select: "first_name last_name email subjects" });
  next();
});

module.exports = mongoose.model("Lesson", LessonSchema);
