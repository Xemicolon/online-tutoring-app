const ash = require("express-async-handler");
const User = require("../../models/User");
require("../../middleware/auth");

exports.register = ash(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  //   if (role === "admin") {
  //     next(res.send("You cannot register as an admin!"));
  //   }
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.send({
        status: 400,
        message: `A user with this email - ${email} exists`,
      });
      return;
    }
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
    }).then((user) => {
      const token = user.generateJWT();
      res
        .cookie("token", token, {
          maxAge: 90000000,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        })
        .json({
          status: 200,
          token: token,
          message: `You have successfully registered! Your user details below`,
          user_details: user,
        });
    });
  } catch (err) {
    res.send({
      status: 500,
      message: err.message,
    });
  }
});

exports.login = ash(async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    //   if no user
    if (!user) {
      res.send({
        status: 400,
        message: `No user with this email - ${email} found!`,
      });
    }
    //   if password is wrong
    if (!user.comparePassword(password)) {
      res.send({
        status: 400,
        message: `Your password is invalid!`,
      });
    }
    //   generate token
    const token = user.generateJWT();
    res
      .cookie("token", token, {
        maxAge: 90000000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        status: 200,
        message: `You have successfully logged in!`,
        token: token,
        user: user,
      });
  } catch (err) {
    res.send({
      status: 500,
      message: err.message,
    });
  }
});

exports.logout = ash(async (req, res, next) => {
  res
    .cookie("token", none, {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    }) 
    .json({
      status: 200,
      message: `You have successfully logged out`,
    });
});
