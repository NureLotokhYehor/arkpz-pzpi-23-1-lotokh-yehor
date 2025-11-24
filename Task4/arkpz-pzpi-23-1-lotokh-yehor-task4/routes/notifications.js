const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const notifController = require("../controllers/notificationController");

router.get("/", auth, notifController.getNotificationsForUser);
router.patch("/:id/read", auth, notifController.markAsRead);

module.exports = router;
