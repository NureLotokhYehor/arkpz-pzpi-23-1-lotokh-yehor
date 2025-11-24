const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema({
  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Animal",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  text: { type: String },
});

module.exports = mongoose.model("Recommendation", recommendationSchema);
