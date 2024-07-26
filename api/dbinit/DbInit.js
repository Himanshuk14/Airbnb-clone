const mongoose = require("mongoose");
require("dotenv").config();
function DbInit() {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database connected");
  });
}
//DbInit();
module.exports = DbInit;
