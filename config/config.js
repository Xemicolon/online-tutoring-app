const mongoose = require("mongoose");

const db = async () => {
  const db_connect = await mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .catch((err) => {
      console.error(err);
    });

  console.log(
    `Database Connected\nDatabase Url: ${db_connect.connection.host}`
  );
};

module.exports = db;
