import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../components/Loader";
import SpotifyCard from "../components/SpotifyCard";
import { useLogout } from "../hooks/useLogout";

const BACKEND_URL = "http://localhost:5000";

export default function Dashboard() {
    const navigate = useNavigate();
    const logout = useLogout();
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [spotifyData, setSpotifyData] = useState(null);
    const [showFlashMsg, setShowFlashMsg] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/session-status`);
                // Backend returns needsRefresh = true if > 1 hour
                if (res.data.needsRefresh) {
                    setShowFlashMsg(true);
                } else {
                    setShowFlashMsg(false);
                }
            } catch (error) {
                console.error("Status check failed", error);
            }
        };

        // Check immediately and then every minute
        checkStatus();
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchSpotifyData = async () => {
        setLoading(true);
        setLoadingText("Extracting your audio DNA...");
        try {
            const res = await axios.get(`${BACKEND_URL}/spotify/all-data`);
            setSpotifyData(res.data);
            toast.success("Data secured. Prepare yourself.", {
                style: { background: "#050505", color: "#fff", border: "1px solid #333" },
                icon: "🧬",
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to breach Spotify's firewall.");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        if (loading) return;
        const toastId = toast.loading("Checking session status...");
        try {
            const statusRes = await axios.get(`${BACKEND_URL}/session-status`);
            const { loggedIn, expiresInHours } = statusRes.data;

            if (!loggedIn || expiresInHours <= 0) {
                toast.error("Session expired. Please login again.", { id: toastId });
                setTimeout(() => navigate("/"), 1000);
                return;
            }

            toast.loading("Refreshing feed...", { id: toastId });
            const dataRes = await axios.get(`${BACKEND_URL}/spotify/all-data`);
            setSpotifyData(dataRes.data);

            // On success, backend resets loginTime, so we hide the message
            setShowFlashMsg(false);

            toast.success("Feed updated!", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Refresh failed. detailed error in console.", { id: toastId });
        }
    };

    const cookMe = async () => {
        setLoading(true);
        setLoadingText("Initiating Roast Protocol v2.5...");
        try {
            const res = await axios.post(`${BACKEND_URL}/ai-roast`);
            if (res.data && res.data.roast_paragraph) {
                navigate("/roast", { state: { roast: res.data } });
            } else {
                throw new Error("Invalid roast data");
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 429) {
                toast.error(error.response.data.error);
            } else {
                toast.error("AI refused to roast you. (Too boring?)");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
                <Loader text={loadingText} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] p-4 md:p-6 lg:p-12 text-white pb-32">

            {/* FLASH MESSAGE BANNER */}
            <AnimatePresence>
                {showFlashMsg && (
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className="fixed top-0 left-0 w-full z-50 bg-yellow-500/10 border-b border-yellow-500/20 backdrop-blur-md"
                    >
                        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-center gap-3 text-yellow-500 text-sm font-mono uppercase tracking-widest text-center">
                            <span>⚠️ Session limit approaching</span>
                            <span className="hidden sm:inline w-1 h-1 bg-yellow-500 rounded-full"></span>
                            <span>Please refresh your feed for a new roast</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between mb-12 sm:mb-16 pt-10 gap-6">
                <div className="flex items-center gap-3">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                    <h1 className="text-lg font-mono text-gray-400 tracking-widest uppercase">
                        Dashboard // {spotifyData ? "Connected" : "Standby"}
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleRefresh}
                        className="text-xs text-green-400 hover:text-green-300 transition uppercase tracking-widest flex items-center gap-2"
                        disabled={loading}
                    >
                        <span>🔄</span> Refresh Feed
                    </button>
                    <button
                        onClick={logout}
                        className="text-xs text-red-500 hover:text-red-400 transition uppercase tracking-widest border border-red-500/20 px-3 py-1 rounded hover:bg-red-500/10"
                    >
                        [ Disconnect ]
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto">
                {!spotifyData ? (
                    <div className="text-center py-20 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-green-500/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative z-10 glass p-8 md:p-16 rounded-[2rem] border border-white/5 inline-block max-w-2xl mx-4"
                        >
                            <div className="text-5xl mb-6">📂</div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Data Access Required</h2>
                            <p className="text-gray-400 mb-10 leading-relaxed text-base md:text-lg">
                                To generate a statistically accurate roast, we need access to your listening history.
                                <br /><span className="text-xs text-gray-600">(We don't save it, mostly because it's embarrassing)</span>
                            </p>
                            <button
                                onClick={fetchSpotifyData}
                                className="bg-[#1DB954] hover:bg-green-400 text-black font-bold text-lg md:text-xl py-4 md:py-5 px-8 md:px-10 rounded-full shadow-[0_0_30px_rgba(29,185,84,0.3)] hover:shadow-[0_0_50px_rgba(29,185,84,0.6)] transition-all transform hover:-translate-y-1 w-full md:w-auto"
                            >
                                GRANT ACCESS 🔓
                            </button>
                        </motion.div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                    >
                        {/* LEFT COLUMN: ACTION & STATS */}
                        <div className="lg:col-span-5 space-y-8 h-full flex flex-col order-2 lg:order-1">

                            {/* COOK ME CTA */}
                            <div className="glass p-10 rounded-[2.5rem] border border-white/10 text-center relative overflow-hidden group flex-1 flex flex-col justify-center items-center min-h-[300px]">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <h3 className="text-4xl font-black mb-4 relative z-10">READY?</h3>
                                <p className="text-gray-400 mb-8 relative z-10 max-w-xs mx-auto">
                                    The model is loaded and judging you already.
                                </p>
                                <button
                                    onClick={cookMe}
                                    className="relative z-10 bg-white text-black font-black text-2xl py-6 px-16 rounded-full hover:scale-105 transition-transform shadow-[0_0_50px_rgba(255,255,255,0.3)] w-full sm:w-auto"
                                >
                                    COOK ME 🔥
                                </button>
                            </div>

                            {/* QUICK STATS */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-40 group hover:border-white/20 transition-colors">
                                    <div className="text-spotify text-3xl">💿</div>
                                    <div>
                                        <div className="text-4xl font-bold text-white group-hover:text-spotify transition-colors">{spotifyData.top_tracks.length}</div>
                                        <div className="text-gray-500 text-xs font-mono uppercase mt-1">Tracks Analyzed</div>
                                    </div>
                                </div>
                                <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-40 group hover:border-white/20 transition-colors">
                                    <div className="text-purple-400 text-3xl">💜</div>
                                    <div>
                                        <div className="text-4xl font-bold text-white group-hover:text-purple-400 transition-colors">{spotifyData.liked_songs.length}</div>
                                        <div className="text-gray-500 text-xs font-mono uppercase mt-1">Liked Songs</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: PREVIEW LIST */}
                        <div className="lg:col-span-7 order-1 lg:order-2">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-200">Evidence 🧾</h2>
                                <span className="text-xs text-gray-600 uppercase tracking-wider">Top 5 Records</span>
                            </div>

                            <div className="space-y-3">
                                {spotifyData.top_tracks.slice(0, 5).map((track, i) => (
                                    <SpotifyCard
                                        key={i}
                                        rank={i + 1}
                                        title={track.name}
                                        subtitle={track.artist}
                                        image={track.image}
                                    />
                                ))}
                            </div>

                            <div className="mt-8 p-6 bg-red-500/5 rounded-2xl border border-red-500/10 text-center">
                                <p className="text-red-400 text-sm font-mono">
                                    ⚠️ Analysis Suggests: {spotifyData.top_tracks[0]?.artist} addiction likely.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
