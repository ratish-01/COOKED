import { motion } from "framer-motion";

const BACKEND_URL = "http://localhost:5000";

export default function Home() {
    const handleLogin = () => {
        window.location.href = `${BACKEND_URL}/login`;
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#050505] flex items-center justify-center">
            {/* Animated Background Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />

            <div className="relative z-10 w-full max-w-4xl px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-10"
                >
                    {/* Badge */}
                    <div className="inline-block glass px-6 py-2 rounded-full border border-white/5">
                        <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
                            Warning: Emotional Damage Ahead ⚠️
                        </span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter text-white mb-2 relative">
                        <span className="relative z-10 mix-blend-difference">COOKED.</span>
                        <motion.span
                            className="absolute inset-0 text-red-500 opacity-30 blur-sm z-0"
                            animate={{ x: [-2, 2, -2] }}
                            transition={{ repeat: Infinity, duration: 0.2 }}
                        >
                            COOKED.
                        </motion.span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
                        Let AI brutally roast your Spotify taste. <br />
                        <span className="text-white font-medium">No playlist is safe.</span>
                    </p>

                    {/* CTA Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogin}
                        className="group relative inline-flex items-center gap-4 px-12 py-6 bg-[#1DB954] text-black rounded-full font-black text-xl tracking-tight overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(29,185,84,0.4)]"
                    >
                        <svg className="w-8 h-8 relative z-10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                        <span className="relative z-10">LOGIN WITH SPOTIFY</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    </motion.button>

                    <div className="pt-10 flex justify-center gap-8 text-sm text-gray-600 font-medium tracking-widest uppercase">
                        <span>Powered by Gemini 2.5</span>
                        <span>•</span>
                        <span>100% Private (Trust Us)</span>
                    </div>

                </motion.div>
            </div>
        </div>
    );
}
