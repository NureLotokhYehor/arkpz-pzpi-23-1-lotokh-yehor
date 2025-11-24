const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const animalController = require("../controllers/animalController");

router.post("/", auth, animalController.createAnimal);
router.get("/:ownerId?", auth, animalController.getAnimalsByOwner);
router.patch("/:id", auth, animalController.updateAnimal);
router.delete("/:id", auth, animalController.deleteAnimal);

module.exports = router;
