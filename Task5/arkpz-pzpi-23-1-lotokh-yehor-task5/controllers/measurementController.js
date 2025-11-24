const Measurement = require("../models/Measurement");
const Animal = require("../models/Animal");
const Notification = require("../models/Notification");
const HealthAlgorithm = require("../models/HealthAlgorithm");

exports.addMeasurement = async (req, res) => {
  try {
    const { animalId, temperature, pulse, cageTemperature } = req.body;

    // простой валидационный чек
    const animal = await Animal.findById(animalId);
    if (!animal) return res.status(404).json({ message: "Animal not found" });

    const m = new Measurement({
      animal: animalId,
      temperature,
      pulse,
      cageTemperature,
    });
    await m.save();

    // простой анализ по текущим правилам (берём первый алгоритм или дефолт)
    const alg = (await HealthAlgorithm.findOne()) || {
      thresholds: { minTemp: 35, maxTemp: 40, minPulse: 40, maxPulse: 200 },
    };
    const t = temperature;
    const p = pulse;
    let alert = null;
    if (t && (t < alg.thresholds.minTemp || t > alg.thresholds.maxTemp)) {
      alert = `Аномальна температура: ${t}°C`;
    } else if (
      p &&
      (p < alg.thresholds.minPulse || p > alg.thresholds.maxPulse)
    ) {
      alert = `Аномальний пульс: ${p} bpm`;
    }

    if (alert) {
      const notif = new Notification({
        user: animal.owner,
        animal: animal._id,
        message: alert,
      });
      await notif.save();
      // TODO: помимо сохранения — пуш/email можно отправить
    }

    res.status(201).json(m);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMeasurementsByAnimal = async (req, res) => {
  try {
    const { animalId } = req.params;
    const items = await Measurement.find({ animal: animalId })
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getLatestMeasurement = async (req, res) => {
  try {
    const { animalId } = req.params;
    const item = await Measurement.findOne({ animal: animalId }).sort({
      timestamp: -1,
    });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
