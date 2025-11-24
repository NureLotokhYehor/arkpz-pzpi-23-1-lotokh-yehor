const HealthData = require("../models/HealthData");
const Recommendation = require("../models/Recommendation");

async function analyzeHealth(animalId) {
  const data = await HealthData.find({ animal_id: animalId })
    .sort({ recorded_at: -1 })
    .limit(1);
  if (!data.length) return null;

  const latest = data[0];
  let recommendations = [];

  if (latest.temperature > 39)
    recommendations.push("Висока температура, зверніться до ветеринара");
  if (latest.pulse > 120)
    recommendations.push("Підвищений пульс, стежте за станом тварини");

  const recs = await Recommendation.create({
    animal_id: animalId,
    recommendation_text: recommendations.join("; "),
  });

  return recs;
}

module.exports = { analyzeHealth };
