import querystring from "querystring";
import axios from "axios";
import sessionStore from "../utils/sessionStore.js";

export const login = (req, res) => {
    const scope = "user-library-read user-read-recently-played user-top-read";
    console.log("REDIRECT URI USED =", process.env.SPOTIFY_REDIRECT_URL);

    const redirectUrl =
        "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
            response_type: "code",
            client_id: process.env.SPOTIFY_CLIENT_ID,
            scope: scope,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URL
        });

    res.redirect(redirectUrl);
};

export const callback = async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send("No code found");
    }

    const token = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URL,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET
    });

    const authHeader = "Basic " + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString("base64");
    try {
        const tokenResponse = await axios.post(
            "https://accounts.spotify.com/api/token",
            token.toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": authHeader
                }
            }
        );

        sessionStore.setAccessToken(tokenResponse.data.access_token);
        sessionStore.setRefreshToken(tokenResponse.data.refresh_token);
        sessionStore.setLoginTime(Date.now());

        console.log("Access token received:", tokenResponse.data);

        res.redirect("http://localhost:5173/after-login");

    } catch (error) {
        console.error("Token exchange failed:", error.response?.data || error);
        res.status(500).send("Error exchanging code for token");
    }
};

export const sessionStatus = (req, res) => {
    const loginTime = sessionStore.getLoginTime();
    if (!loginTime) {
        return res.json({ loggedIn: false });
    }

    const elapsed = Date.now() - loginTime;
    const lastRoastTime = sessionStore.getLastRoastTime();
    const COOLDOWN_MS = 5 * 60 * 1000;
    const timeSinceLastRoast = Date.now() - (lastRoastTime || 0);
    const roastCooldownRemaining = Math.max(0, COOLDOWN_MS - timeSinceLastRoast);

    res.json({
        loggedIn: true,
        minutesSinceLogin: Math.floor(elapsed / 60000),
        needsRefresh: elapsed > 60 * 60 * 1000,
        expiresInHours: Math.max(0, 24 - elapsed / 3600000),
        roastCooldownRemaining
    });
};

export const afterLogin = (req, res) => {
    if (sessionStore.getAccessToken()) {
        return res.json({
            loggedIn: true,
            message: "Spotify login successful!"
        });
    }

    return res.json({
        loggedIn: false,
        message: "Not logged in yet"
    });
};

export const logout = (req, res) => {
    sessionStore.clearSession();
    console.log("User logged out, session cleared.");
    res.json({ message: "Logged out successfully" });
};
