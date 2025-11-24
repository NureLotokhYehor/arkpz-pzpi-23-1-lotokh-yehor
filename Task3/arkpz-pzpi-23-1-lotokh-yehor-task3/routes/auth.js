const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");

router.post(
  "/registration",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  authController.register
);

router.post("/login", authController.login);
router.post("/logout", authController.logout);

module.exports = router;
