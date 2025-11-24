require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const animalsRoutes = require("./routes/animals");
const measurementsRoutes = require("./routes/measurements");
const recommendationsRoutes = require("./routes/recommendations");
const notificationsRoutes = require("./routes/notifications");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/vetmonitor");

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
// Підключення Swagger
const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRoutes);
app.use("/api/animals", animalsRoutes);
app.use("/api/measurements", measurementsRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/notifications", notificationsRoutes);

app.use("/api/health", healthRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.send("VetMonitor API"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
