const mongoose = require("mongoose");

const sessionSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  Access_Token: {
    type: String,
    required: true,
  },
  Refresh_Token: {
    type: String,
    required: true,
  },
  ExpiresIn: {
    type: String,
    required: true,
  },
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
