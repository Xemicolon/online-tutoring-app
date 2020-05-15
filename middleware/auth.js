const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ash = require("express-async-handler");

exports.authorizeRole = (role) => {
  return ash(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.send({
        status: 401,
        message: `No user with this email exists and this is an unauthorized route`,
      });
      return;
    }

    if (user.isAdmin === false) {
      res.send({
        status: 401,
        message: `You don't have enough permissions to view this route`,
      });
      return;
    }
    next();
  });
};

exports.verifyToken = ash(async (req, res, next) => {
  let token = req.headers.cookie.split("token=").join("");
  if (token) {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (decoded) {
      req.decoded = decoded;
      token = req.headers.cookie.split("token=").join("");
      next();
    } else {
      res.send("Invalid token");
    }
  } else {
    return res.json({
      status: 401,
      message: `You're not authorized to view this page!`,
    });
  }
});
