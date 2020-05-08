require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./config/config");
const cors = require("cors");
const morgan = require("morgan");
const indexRouter = require("./routes/index");
const Routes = require("./routes/routes");
const adminRoute = require("./routes/admin");

db();
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.listen(
  PORT,
  console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`)
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api/v1", indexRouter);
app.use("/api/v1", Routes);
app.use("/api/v1", adminRoute);
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});
