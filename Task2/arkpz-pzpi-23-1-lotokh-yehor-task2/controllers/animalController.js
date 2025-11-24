const Animal = require("../models/Animal");

exports.createAnimal = async (req, res) => {
  try {
    const { name, species, breed, age } = req.body;
    const owner = req.user._id;
    const animal = new Animal({ name, species, breed, age, owner });
    await animal.save();
    res.status(201).json(animal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAnimalsByOwner = async (req, res) => {
  try {
    const ownerId = req.params.ownerId || req.user._id;
    const animals = await Animal.find({ owner: ownerId });
    res.json(animals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(animal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteAnimal = async (req, res) => {
  try {
    await Animal.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
