require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./config/config");
const cors = require("cors");
const General = require('./routes/general')
const Routes = require("./routes/routes");
const IndexRoute = require("./routes/index");
const AuthRoutes = require("./routes/auth");
const TutorRoute = require("./routes/tutor");

db();
const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`)
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); 

app.use("/api/v1", AuthRoutes);
app.use("/api/v1", IndexRoute);
app.use("api/v1", General)
app.use("/api/v1", Routes);
app.use("/api/v1", TutorRoute);
app.use("*", (req, res, next) => {
  res.send("This page doesn't exist (yet).");
  next();
});
