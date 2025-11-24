const Notification = require("../models/Notification");

exports.getNotificationsForUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const items = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: "OK" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
