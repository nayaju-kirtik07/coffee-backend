const mongoose = require("mongoose");

const url =
  process.env.CONNECTION_STRING ||
  "mongodb://localhost:27017/Workspace-database";

const connectToDatabase = async (cb) => {
  try {
    await mongoose.connect(url);

    cb();
    return mongoose.connection;
    console.log("database connected successfully!");
  } catch (err) {
    console.error("failed to connect to database", err);
    throw err;
  }
};

module.exports = { connectToDatabase };
