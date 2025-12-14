import axios from "axios";
import sessionStore from "./sessionStore.js";

export async function refreshSpotifyToken() {
    try {
        const refreshToken = sessionStore.getRefreshToken();
        if (!refreshToken) {
            console.error("No refresh token available");
            return;
        }

        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET
            }).toString(),
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            }
        );

        sessionStore.setAccessToken(response.data.access_token);
        if (response.data.refresh_token) {
            sessionStore.setRefreshToken(response.data.refresh_token);
        }
        console.log("Spotify token refreshed");
    } catch (error) {
        console.error("Error refreshing Spotify token:", error.response?.data || error.message);
    }
}

export async function ensureValidToken() {
    const ONE_HOUR = 60 * 60 * 1000;
    const loginTime = sessionStore.getLoginTime();

    if (loginTime && Date.now() - loginTime > ONE_HOUR) {
        await refreshSpotifyToken();
        sessionStore.setLoginTime(Date.now());
    }
}
