const mongoose = require("mongoose");

const healthAlgorithmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  thresholds: {
    minTemp: Number,
    maxTemp: Number,
    minPulse: Number,
    maxPulse: Number,
  },
  version: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("HealthAlgorithm", healthAlgorithmSchema);
