const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const ash = require("express-async-handler");

exports.authorizeRole = (role) => {
  return ash(async (req, res, next) => {
    const { email } = req.body;
    const user = await Admin.findOne({ email });

    if (!user) {
      res.status(400).send({
        status: false,
        message: `No user with this email exists and this is an unauthorized route`,
      });
      return;
    }

    if (user.role !== role) {
      res.status(401).send({
        status: false,
        message: `You don't have enough permissions to view this route`,
      });
      return;
    }
    next();
  });
};

exports.verifyToken = async (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Incorrect token",
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({
      message: `You're not authorized to view this page!`,
    });
  }
};
