const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      enum: ["PRIMARY", "JSS", "SSS"],
      required: [true, "Add a name of the category"],
      uppercase: true,
    },
    description: {
      type: String,
    }, 
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
