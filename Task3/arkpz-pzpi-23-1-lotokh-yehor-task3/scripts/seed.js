require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Animal = require("../models/Animal");
const connectDB = require("../config/db");

const run = async () => {
  await connectDB(
    process.env.MONGO_URI || "mongodb://localhost:27017/vetmonitor"
  );
  await User.deleteMany({});
  await Animal.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("password123", salt);

  const user = new User({
    firstName: "Test",
    lastName: "Owner",
    email: "owner@example.com",
    passwordHash,
    role: "owner",
  });
  await user.save();

  const animal = new Animal({
    name: "Buddy",
    species: "Dog",
    breed: "Mixed",
    age: 4,
    owner: user._id,
  });
  await animal.save();

  console.log("Seed done. User:", user.email, "Animal:", animal.name);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
