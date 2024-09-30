const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    default: "User",
  },
  visibility: {
    type: Boolean,
    default: true,
  },
  userDetail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserDetail",
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", UserSchema);
