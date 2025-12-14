import sessionStore from "../utils/sessionStore.js";
import { ensureValidToken } from "../utils/spotifyHelpers.js";

export async function ensureAuthenticated(req, res, next) {
    if (!sessionStore.getAccessToken()) {
        console.log("No access token present! Not logged in yet.");
        // Depending on the route, you might want to return 401, but for now we'll just log
        // or functionality inside routes might handle the null token.
        // However, the original code had checks inside the routes.
        // For strict middleware, we can do:
        // return res.status(401).json({ message: "Not logged in" });
    }

    await ensureValidToken();
    next();
}
