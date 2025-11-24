const express = require("express");
const router = express.Router();
const { analyzeHealth } = require("../controllers/healthController");

router.get("/:animalId", async (req, res) => {
  try {
    const result = await analyzeHealth(req.params.animalId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
