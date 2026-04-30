const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  date: String,
  location: String,
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  type: {
    type: String,
    enum: ["college", "music", "tech", "night", "sports"]
  },
  image: String
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);