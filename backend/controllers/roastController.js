import { roastMusicTaste } from "../utils/gemini.js";
import sessionStore from "../utils/sessionStore.js";

export const roastUser = async (req, res) => {
    try {
        const lastRoastTime = sessionStore.getLastRoastTime();
        const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

        if (lastRoastTime && Date.now() - lastRoastTime < COOLDOWN_MS) {
            const remaining = Math.ceil((COOLDOWN_MS - (Date.now() - lastRoastTime)) / 1000);
            return res.status(429).json({
                error: `You are roasting too fast! Chill for ${remaining} seconds.`,
                cooldownRemaining: COOLDOWN_MS - (Date.now() - lastRoastTime)
            });
        }

        const spotifyData = sessionStore.getSpotifyDataCache();
        if (!spotifyData) {
            return res.status(400).send("No Spotify data available for roasting");
        }
        const roastedOutput = await roastMusicTaste(spotifyData);

        sessionStore.setLastRoastTime(Date.now());
        res.json(roastedOutput);

    } catch (error) {
        console.error("AI roast failed:", error);
        res.status(500).send("AI processing failed");
    }
};
