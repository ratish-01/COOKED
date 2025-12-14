// Singleton to manage global state
const sessionStore = {
    accessToken: null,
    refreshToken: null,
    loginTime: null,
    lastRoastTime: 0,
    spotifyDataCache: null,

    // Getters and Setters
    setAccessToken(token) { this.accessToken = token; },
    getAccessToken() { return this.accessToken; },

    setRefreshToken(token) { this.refreshToken = token; },
    getRefreshToken() { return this.refreshToken; },

    setLoginTime(time) { this.loginTime = time; },
    getLoginTime() { return this.loginTime; },

    setLastRoastTime(time) { this.lastRoastTime = time; },
    getLastRoastTime() { return this.lastRoastTime; },

    setSpotifyDataCache(data) { this.spotifyDataCache = data; },
    getSpotifyDataCache() { return this.spotifyDataCache; },

    clearSession() {
        this.accessToken = null;
        this.refreshToken = null;
        this.loginTime = null;
        this.spotifyDataCache = null;
    }
};

export default sessionStore;
