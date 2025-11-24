const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema({
  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Animal",
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  temperature: { type: Number }, // °C
  pulse: { type: Number }, // bpm
  cageTemperature: { type: Number }, // °C, optional
});

module.exports = mongoose.model("Measurement", measurementSchema);
