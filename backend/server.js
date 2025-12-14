import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import spotifyRoutes from "./routes/spotifyRoutes.js";
import roastRoutes from "./routes/roastRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

// Health check
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Routes
app.use("/", authRoutes);
app.use("/spotify", spotifyRoutes);
app.use("/", roastRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on", PORT);
});
