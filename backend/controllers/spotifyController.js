import axios from "axios";
import sessionStore from "../utils/sessionStore.js";
import { ensureValidToken } from "../utils/spotifyHelpers.js";

export const getSpotifyData = async (req, res) => {
    await ensureValidToken();
    const accessToken = sessionStore.getAccessToken();

    if (!accessToken) {
        console.log("No access token present! Not logged in yet.");
        // Continuing logic as per original server.js which didn't explicitly return here, 
        // but it's safer to check. Original had logic to catch error if token invalid.
    }

    sessionStore.setLastRoastTime(0); // Resetting per original code logic in /spotify/all-data

    try {
        const [topTracksResponse, likedSongsResponse, recentlyPlayedResponse, mostheardresponse] = await Promise.all([
            axios.get("https://api.spotify.com/v1/me/top/tracks", {
                headers: { Authorization: `Bearer ${accessToken}` }
            }),
            axios.get("https://api.spotify.com/v1/me/tracks", {
                headers: { Authorization: `Bearer ${accessToken}` }
            }),
            axios.get("https://api.spotify.com/v1/me/player/recently-played", {
                headers: { Authorization: `Bearer ${accessToken}` }
            }),
            axios.get("https://api.spotify.com/v1/me/top/tracks", {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: { limit: 20, time_range: "short_term" }
            })
        ]);

        const top_tracks_json = topTracksResponse.data.items || [];
        const liked_songs_json = likedSongsResponse.data.items || [];
        const recently_played_json = recentlyPlayedResponse.data.items || [];
        const most_heard_songs_json = mostheardresponse.data.items || [];

        const top_tracks = top_tracks_json.map((track) => ({
            name: track.name,
            artist: track.artists?.[0]?.name || "Unknown",
            image: track.album?.images?.[0]?.url || null,
            album: track.album?.name || null,
            popularity: track.popularity ?? null,
            spotifyUrl: track.external_urls?.spotify || null,
        }));

        const liked_songs = liked_songs_json.map((item) => {
            const track = item.track;
            return {
                name: track.name,
                artist: track.artists?.[0]?.name || "Unknown",
                image: track.album?.images?.[0]?.url || null,
                album: track.album?.name || null,
                popularity: track.popularity ?? null,
                spotifyUrl: track.external_urls?.spotify || null,
                added_at: item.added_at
            };
        });

        const recently_played = recently_played_json.map((item) => {
            const track = item.track;
            return {
                name: track.name,
                artist: track.artists?.[0]?.name || "Unknown",
                image: track.album?.images?.[0]?.url || null,
                album: track.album?.name || null,
                popularity: track.popularity ?? null,
                spotifyUrl: track.external_urls?.spotify || null,
                added_at: item.added_at
            };
        });

        const most_heard = most_heard_songs_json.map(track => ({
            name: track.name,
            artist: track.artists?.[0]?.name,
            image: track.album?.images[0]?.url,
            album: track.album?.name,
            popularity: track.popularity,
            spotifyUrl: track.external_urls?.spotify,
        }));

        const data = {
            top_tracks,
            liked_songs,
            recently_played,
            most_heard
        };

        sessionStore.setSpotifyDataCache(data);
        res.json(data);
    }
    catch (error) {
        console.error("Error fetching Spotify data:", error.response?.data || error);
        return res.status(500).send("Error fetching Spotify data");
    }
};
