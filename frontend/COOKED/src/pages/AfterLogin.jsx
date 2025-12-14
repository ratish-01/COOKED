import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const BACKEND_URL = "http://localhost:5000";

export default function AfterLogin() {
    const navigate = useNavigate();
    const [statusText, setStatusText] = useState("Establishing Connection...");

    useEffect(() => {
        const checkStatus = async () => {
            setStatusText("Verifying Credentials...");
            try {
                const res = await axios.get(`${BACKEND_URL}/after-login`);
                if (res.data.loggedIn) {
                    setStatusText("Access Granted. Preparing Dashboard...");
                    setTimeout(() => navigate("/dashboard"), 800);
                } else {
                    setStatusText("Access Denied. Redirecting...");
                    setTimeout(() => navigate("/"), 1000);
                }
            } catch (error) {
                console.error("Login check failed", error);
                setStatusText("Connection Error.");
                navigate("/");
            }
        };

        const timer = setTimeout(checkStatus, 1500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] relative overflow-hidden">

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/10 via-black to-black" />

            <div className="relative z-10 flex flex-col items-center">
                {/* Glitchy Loader */}
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

                {/* Status Text */}
                <motion.h2
                    key={statusText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xl font-mono text-green-400 tracking-widest uppercase"
                >
                    {statusText}
                </motion.h2>
            </div>
        </div>
    );
}
