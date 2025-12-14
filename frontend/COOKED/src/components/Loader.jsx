import { motion } from "framer-motion";

export default function Loader({ text }) {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative mb-8">
                <motion.div
                    className="w-24 h-24 rounded-full border-t-4 border-r-4 border-green-500/50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, ease: "linear", repeat: Infinity }}
                />
                <motion.div
                    className="absolute inset-0 w-24 h-24 rounded-full border-l-4 border-b-4 border-purple-500/50"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">
                    🔥
                </div>
            </div>
            <p className="text-green-400 font-mono text-xl tracking-widest uppercase animate-pulse">{text || "Loading..."}</p>
        </div>
    );
}
