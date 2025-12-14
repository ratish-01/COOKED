import express from "express";
import { getSpotifyData } from "../controllers/spotifyController.js";

const router = express.Router();

// Original route was /spotify/all-data, verify if we want to keep prefix in server.js or here.
// I will keep the path relative to the mounting point.
// If server.js mounts at /, then path is /spotify/all-data
// If server.js mounts at /spotify, then path is /all-data
// I will configure server.js to use specific prefixes or mount at root.
// For simplicity and matching original exactly, I'll define full path segments here if mounting at root,
// OR better, mount at root in server.js and define paths here.

router.get("/all-data", getSpotifyData);

export default router;
