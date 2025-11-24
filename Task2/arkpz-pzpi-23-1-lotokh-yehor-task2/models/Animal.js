const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String },
  breed: { type: String },
  age: { type: Number },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Animal", animalSchema);
