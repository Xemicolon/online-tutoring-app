const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const TutorSchema = new Schema(
  {
    first_name: {
      type: String,
      required: [true, "Please enter a first name"],
    },
    last_name: { type: String, required: [true, "Please enter a last name"] },

    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: 6,
    },
    role: {
      type: String,
      default: "tutor",
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true
    },
    subjects: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
    },
  },
  { timestamps: true }
);

TutorSchema.pre("save", async function (next) {
  let user = this;
  if (!user.isModified || !user.isNew) return next();
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

TutorSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

TutorSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  let payload = {
    id: this._id,
    email: this.email,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
  };

  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: parseInt(expirationDate.getTime() / 1000, 10),
  });
};

module.exports = mongoose.model("Tutor", TutorSchema);
