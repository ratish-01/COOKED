import { motion } from "framer-motion";

export default function SpotifyCard({ title, subtitle, image, rank }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center p-4 bg-[#0A0A0A] hover:bg-white/5 border border-white/5 rounded-2xl transition-all duration-300 group cursor-default shadow-lg hover:shadow-spotify/10"
        >
            <div className="w-8 text-gray-500 font-mono text-sm">{rank}</div>
            {image && (
                <img src={image} alt={title} className="w-12 h-12 rounded-lg object-cover mr-4 shadow-md group-hover:scale-105 transition-transform duration-300" />
            )}
            <div className="flex-1 overflow-hidden">
                <h4 className="font-bold text-gray-200 truncate group-hover:text-[#1DB954] transition-colors">{title}</h4>
                <p className="text-gray-500 text-xs truncate uppercase tracking-wider">{subtitle}</p>
            </div>
        </motion.div>
    );
}
