const mongoose = require("mongoose");

const AnalyticsSchema = mongoose.Schema({
  Date: {
    type: Date,
    default: Date.now,
  },
  userId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  noOfVisitADay: {
    type: Number,
    default: 0,
  },
  newUsers: {
    type: Number,
    default: 0,
  },
});

const AnalyticsModel = mongoose.model("AnalyticsModel", AnalyticsSchema);
