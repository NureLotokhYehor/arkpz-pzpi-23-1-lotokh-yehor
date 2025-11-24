const express = require("express");
const router = express.Router();
const {
  createUser,
  deleteUser,
  createAdmin,
} = require("../controllers/adminController");

router.post("/user", async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/user/:id", async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/admin", async (req, res) => {
  try {
    const admin = await createAdmin(req.body);
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
