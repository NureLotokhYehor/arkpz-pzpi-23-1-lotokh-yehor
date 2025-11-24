const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const recController = require("../controllers/recommendationController");

router.post("/", auth, recController.createRecommendation);
router.get("/:animalId", auth, recController.getRecommendations);

module.exports = router;
