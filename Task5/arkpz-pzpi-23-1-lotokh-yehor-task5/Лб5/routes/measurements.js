const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const measurementController = require("../controllers/measurementController");

// Эндпоинт для приема измерений от клиентов (может использоваться с API-key в будущем)
router.post("/", auth, measurementController.addMeasurement);
router.get("/:animalId", auth, measurementController.getMeasurementsByAnimal);
router.get(
  "/latest/:animalId",
  auth,
  measurementController.getLatestMeasurement
);

module.exports = router;
