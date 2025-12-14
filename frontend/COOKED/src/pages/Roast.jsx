import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLogout } from "../hooks/useLogout";

const BACKEND_URL = "http://localhost:5000";

export default function Roast() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const logout = useLogout();
    const [cooldownRemaining, setCooldownRemaining] = useState(0);

    // Use fallback if state is missing (for dev/testing) or ensure robust check
    const roast = state?.roast;

    useEffect(() => {
        if (!roast) {
            navigate("/dashboard");
        }
    }, [roast, navigate]);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await axios.get(`${BACKEND_URL}/session-status`);
                if (res.data.roastCooldownRemaining > 0) {
                    setCooldownRemaining(res.data.roastCooldownRemaining);
                }
            } catch (error) {
                console.error("Status check failed", error);
            }
        };
        checkStatus();
    }, []);

    // Timer countdown effect
    useEffect(() => {
        if (cooldownRemaining <= 0) return;
        const timer = setInterval(() => {
            setCooldownRemaining((prev) => Math.max(0, prev - 1000));
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldownRemaining]);

    const formatTime = (ms) => {
        if (ms <= 0) return "";
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleRefresh = async () => {
        const toastId = toast.loading("Verifying session...");
        try {
            const statusRes = await axios.get(`${BACKEND_URL}/session-status`);
            const { loggedIn, expiresInHours } = statusRes.data;

            if (!loggedIn || expiresInHours <= 0) {
                toast.error("Session expired. Please login again.", { id: toastId });
                navigate("/");
                return;
            }

            toast.loading("Refreshing feed...", { id: toastId });
            await axios.get(`${BACKEND_URL}/spotify/all-data`);
            toast.success("Feed updated! Redirecting...", { id: toastId });
            setTimeout(() => navigate("/dashboard"), 1000);
        } catch (error) {
            console.error(error);
            toast.error("Refresh failed.", { id: toastId });
        }
    };

    if (!roast) return null;

    // Destructure new fields with safe defaults
    const {
        roast_paragraph,
        scores = {},
        fun_cooked_points = [],
        fun_facts = [],
        main_character_energy = {},
        era_analysis = {},
        music_personality = {},
        spotify_algorithm_opinion = {},
        listener_warnings = [],
        fake_music_stats = {},
        most_overplayed_song_roast = {},
        song_based_observations = {}
    } = roast;

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 pb-32">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* HERO SECTION */}
                <header className="text-center pt-8 md:pt-16 space-y-6 relative z-10">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 drop-shadow-2xl">
                            COOKED.
                        </h1>
                        <p className="text-gray-400 text-lg uppercase tracking-[0.2em] font-medium">
                            Global Roast Protocol // Active
                        </p>
                    </motion.div>

                    <div className="absolute top-0 right-0 p-4 flex gap-4">
                        <button
                            onClick={handleRefresh}
                            className="text-xs text-green-400 hover:text-green-300 transition uppercase tracking-widest flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-green-500/20 hover:border-green-500"
                        >
                            <span>🔄</span> Refresh Feed
                        </button>
                        <button
                            onClick={logout}
                            className="text-xs text-red-500 hover:text-red-400 transition uppercase tracking-widest flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-red-500/20 hover:border-red-500"
                        >
                            <span>🔌</span> Disconnect
                        </button>
                    </div>
                </header>

                {/* THE VERDICT (HERO ROAST) */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-orange-500 to-purple-600 rounded-3xl opacity-20 blur transition duration-1000 group-hover:opacity-40 animate-pulse"></div>
                    <div className="relative glass p-8 md:p-14 rounded-3xl border border-white/10 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-500" />
                        <h2 className="text-xs font-bold tracking-[0.2em] text-red-500 uppercase mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                            System Verdict
                        </h2>
                        <p className="text-2xl md:text-4xl leading-relaxed font-light text-gray-100 italic">
                            "{roast_paragraph}"
                        </p>
                    </div>
                </motion.div>

                {/* SCORES GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ScoreCard label="Uniqueness" score={scores.uniqueness} color="from-blue-400 to-cyan-300" delay={0.3} />
                    <ScoreCard label="Emotional Dmg" score={scores.emotional_damage} color="from-red-500 to-rose-400" delay={0.4} />
                    <ScoreCard label="Cringe Factor" score={scores.cringe_factor} color="from-yellow-400 to-orange-300" delay={0.5} />
                    <ScoreCard label="Taste Score" score={scores.overall_taste} color="from-green-400 to-emerald-300" delay={0.6} />
                </div>

                {/* IDENTITY MATRIX (3 Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <IdentityCard
                        title="Main Character Energy"
                        value={main_character_energy.type}
                        desc={main_character_energy.description}
                        delay={0.7}
                        icon="🎭"
                    />
                    <IdentityCard
                        title="Era Analysis"
                        value={era_analysis.mentally_stuck_in}
                        desc={era_analysis.description}
                        delay={0.8}
                        icon="⏳"
                    />
                    <IdentityCard
                        title="Music Personality"
                        value={music_personality.label}
                        desc={music_personality.behavior}
                        delay={0.9}
                        icon="🧠"
                    />
                </div>

                {/* STATS & ALGORITHM OPINION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Fake Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2 glass p-8 rounded-3xl border border-white/5 space-y-6"
                    >
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-200">
                            <span className="text-purple-400">📊</span> Statistical Failures
                        </h3>
                        <div className="space-y-6">
                            <StatBar label="Sad Song Percentage" value={fake_music_stats.sad_song_percentage} color="bg-blue-500" />
                            <StatBar label="Repeat Tendency" value={fake_music_stats.repeat_song_tendency} color="bg-orange-500" />
                            <StatBar label="Late Night Listening" value={fake_music_stats.late_night_listening_score} color="bg-indigo-500" />
                        </div>
                    </motion.div>

                    {/* Algorithm Opinion */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="glass p-8 rounded-3xl border border-white/5 flex flex-col justify-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Spotify's Secret Note</h3>
                        <p className="text-xl font-medium text-gray-200 leading-relaxed">
                            "{spotify_algorithm_opinion.thoughts}"
                        </p>
                    </motion.div>
                </div>

                {/* FUN FACTS & CAROUSEL */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                        <span>💀</span> Fun Cooked Points
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {fun_cooked_points.map((point, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl hover:border-red-500/30 transition-colors"
                            >
                                <p className="text-gray-300 leading-snug">{point}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* WARNINGS */}
                <div className="border-t border-white/10 pt-10">
                    <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="p-3 bg-red-500/10 rounded-full text-red-500 text-2xl">⚠️</div>
                        <div className="flex-1">
                            <h4 className="text-red-400 font-bold uppercase tracking-widest text-sm mb-2">Listener Warnings</h4>
                            <ul className="list-disc list-inside text-gray-400 space-y-1">
                                {listener_warnings.map((w, i) => <li key={i}>{w}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ACTION */}
                <div className="text-center pt-10 pb-20">
                    <button
                        disabled={cooldownRemaining > 0}
                        onClick={() => navigate("/dashboard")}
                        className={`group relative px-12 py-5 font-black text-xl rounded-full overflow-hidden transition-all duration-300 ${cooldownRemaining > 0
                                ? "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
                                : "bg-white text-black hover:scale-105"
                            }`}
                    >
                        <span className="relative z-10">
                            {cooldownRemaining > 0
                                ? `COOLDOWN: ${formatTime(cooldownRemaining)}`
                                : "ROAST AGAIN 🔄"}
                        </span>
                        {cooldownRemaining <= 0 && (
                            <div className="absolute inset-0 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                        )}
                    </button>
                    <p className="mt-6 text-xs text-gray-600 uppercase tracking-widest">Constructed by AI • Emotional Damage Not Insured</p>
                </div>

            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function ScoreCard({ label, score, color, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.5 }}
            className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/5 text-center relative overflow-hidden group hover:border-white/10 transition-colors"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            <div className={`text-5xl font-black mb-2 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                {score}
            </div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</div>
        </motion.div>
    )
}

function IdentityCard({ title, value, desc, delay, icon }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className="glass p-8 rounded-3xl border border-white/5 flex flex-col h-full hover:-translate-y-2 transition-transform duration-300"
        >
            <div className="text-3xl mb-4">{icon}</div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{title}</h3>
            <div className="text-2xl font-bold text-white mb-3 leading-tight">{value}</div>
            <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
        </motion.div>
    )
}

function StatBar({ label, value, color }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-400">{label}</span>
                <span className="text-white">{value}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${color} rounded-full`}
                />
            </div>
        </div>
    )
}
