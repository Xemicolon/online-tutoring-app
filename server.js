require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./config/config");
const cors = require("cors");
const Routes = require("./routes/routes");
const adminRoute = require("./routes/admin");
const IndexRouter = require("./routes/index");

db();
const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`)
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/v1", IndexRouter);
app.use("/api/v1", Routes);
app.use("/api/v1", adminRoute);
