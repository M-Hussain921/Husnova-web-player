import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectRedis } from "./config/redisClient.js";
import { connectMongo } from "./config/mongoClient.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import apiRoutes from "./routes/api.routes.js";

const app = express();
app.use(
  cors(
    "https://localhost:5173",
    "https://husnova-web-player.vercel.app/",
    "https://husnovaweb.netlify.app/",
  ),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api", apiRoutes);

const startServer = async () => {
  const port = process.env.PORT || 4000;

  try {
    await connectMongo();
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }

  try {
    await connectRedis();
    console.log("Redis connected");
  } catch (err) {
    console.warn("Redis connection failed (caching disabled):", err.message);
  }

  app.listen(port, () => console.log(`Server running on port ${port}`));
};

startServer();
