const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LessonSchema = new Schema(
  {
    subject: { type: Schema.Types.ObjectId, ref: "Subject" },
    tutor: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    booked_by: {
      type: String,
    },
  },
  { timestamps: true }
);
 
// LessonSchema.index({ student: 1, tutor: 1 }, { unique: true });

module.exports = mongoose.model("Lesson", LessonSchema);
