const ash = require("express-async-handler");
const Student = require("../../models/Student");
require("../../middleware/auth");

exports.register = ash(async (req, res, next) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    const user = await Student.findOne({ email });

    if (user) {
      res.status(401).json({
        status: false,
        message: `A student with this email - ${email} exists`,
      });
      return;
    }

    const newUser = Student.create({
      first_name,
      last_name,
      email,
      password,
    }).then((user) => {
      const token = user.generateJWT();
      res
        .status(200)
        .cookie("token", token, {
          expires: new Date(Date.now() + 10),
          httpOnly: true,
        })
        .send({
          status: true,
          token: token,
          user: user,
        });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route POST api/auth/login
// @desc Login user and return JWT token
// @access Public
exports.login = ash(async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await Student.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: false,
        message: `The email address ${email} is not associated with any account. Double-check your email address and try again.`,
      });
    }
    //validate password
    if (!user.comparePassword(req.body.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = user.generateJWT();
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 10),
        httpOnly: true,
      })
      .json({ token: token, user: user });
  } catch (err) {
    console.log(err);
  }
});
