const Recommendation = require("../models/Recommendation");

exports.createRecommendation = async (req, res) => {
  try {
    const { animalId, text } = req.body;
    const rec = new Recommendation({ animal: animalId, text });
    await rec.save();
    res.status(201).json(rec);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const { animalId } = req.params;
    const recs = await Recommendation.find({ animal: animalId }).sort({
      createdAt: -1,
    });
    res.json(recs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
