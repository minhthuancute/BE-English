const mongoose = require("mongoose");

const URL = process.env.MONGO_URL_LOCAL;

mongoose
  .connect(URL)
  .then(() => {
    console.log("Connect to db success");
  })
  .catch((err) => {
    console.log("Err in connect DB " + err);
  });
