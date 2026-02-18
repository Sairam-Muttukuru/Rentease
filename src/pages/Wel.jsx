import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Building2, UserCheck, ShieldCheck, Sparkles } from 'lucide-react';
import logo from "/favicon.png";
// Exported for use in App.jsx as a first-launch preloader
export const RentEaseLoader = ({ onComplete }) => {
    const [loadingStep, setLoadingStep] = useState(0);
    const [progress, setProgress] = useState(0);

    const steps = [
        { text: "Connecting Tenants...", icon: <UserCheck className="w-5 h-5" /> },
        { text: "Empowering Landlords...", icon: <Building2 className="w-5 h-5" /> },
        { text: "Optimizing Management...", icon: <ShieldCheck className="w-5 h-5" /> },
        { text: "Reimagining Everything.", icon: <Sparkles className="w-5 h-5 text-cyan-400" /> }
    ];

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(() => onComplete?.(), 800);
                    return 100;
                }
                return prev + 1;
            });
        }, 35);

        const stepInterval = setInterval(() => {
            setLoadingStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 1000);

        return () => {
            clearInterval(progressInterval);
            clearInterval(stepInterval);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020617] overflow-hidden">
            {/* 1. ATMOSPHERIC BACKGROUND ELEMENTS */}
            {/* Animated Mesh Glows */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.25, 0.15]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 blur-[160px] rounded-full"
            />
            <motion.div
                animate={{
                    x: [-20, 20, -20],
                    y: [-20, 20, -20]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full"
            />

            {/* Floating Particles (Simulated with simple dots) */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/20 rounded-full"
                    initial={{
                        x: Math.random() * 2000 - 1000,
                        y: Math.random() * 2000 - 1000,
                        opacity: Math.random()
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0.1, 0.4, 0.1]
                    }}
                    transition={{
                        duration: 5 + Math.random() * 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}

            <div className="relative z-10 flex flex-col items-center">
                {/* 2. THE MULTI-LAYERED AURA SYSTEM */}
                <div className="relative mb-16 flex items-center justify-center">
                    {/* Layer 1: Core Pulse (Broad & Soft) */}
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-64 h-64 bg-blue-500/15 rounded-full blur-3xl"
                    />

                    {/* Layer 2: Intermediate Halo (Tighter & Brighter) */}
                    <motion.div
                        animate={{
                            scale: [0.8, 1.1, 0.8],
                            opacity: [0.4, 0.8, 0.4]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl border border-indigo-400/10"
                    />

                    {/* Layer 3: Inner Core Glow (Sharp focus) */}
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-40 h-40 bg-cyan-400/10 rounded-full blur-xl ring-2 ring-cyan-400/20"
                    />

                    {/* Main Animated Logo */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        className="relative z-10"
                    >
                        <motion.div
                            animate={{
                                y: [0, -12, 0],
                                filter: [
                                    "drop-shadow(0 0 20px rgba(59,130,246,0.3))",
                                    "drop-shadow(0 0 40px rgba(59,130,246,0.6))",
                                    "drop-shadow(0 0 20px rgba(59,130,246,0.3))"
                                ]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="flex items-center justify-center p-8"
                        >
                            <img
                                src={logo}
                                alt="Rentease"
                                className="w-48 h-48 object-contain"
                            />
                        </motion.div>
                    </motion.div>
                </div>

                {/* 3. TYPOGRAPHY & PROGRESS */}
                <div className="flex flex-col items-center gap-6">
                    <div className="text-center space-y-2">
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-extrabold text-white tracking-widest uppercase"
                        >
                            Rent<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Ease</span>
                        </motion.h1>

                        {/* Status Message */}
                        <div className="h-6 flex items-center justify-center overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={loadingStep}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="flex items-center gap-3 text-slate-500 font-bold text-xs uppercase tracking-[0.3em]"
                                >
                                    <span className="text-blue-500">{steps[loadingStep].icon}</span>
                                    <span>{steps[loadingStep].text}</span>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Progress Bar System */}
                    <div className="space-y-4 flex flex-col items-center">
                        <div className="w-72 h-[3px] bg-white/5 rounded-full overflow-hidden backdrop-blur-md relative border border-white/5">
                            {/* Animated Background Shimmer */}
                            <motion.div
                                animate={{ x: [-288, 288] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full h-full"
                            />

                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "linear" }}
                                style={{ boxShadow: '0 0 20px rgba(59,130,246,0.8)' }}
                            />
                        </div>

                        {/* Percentage Indication */}
                        <div className="flex items-center gap-4">
                            <div className="h-[1px] w-8 bg-gradient-to-l from-slate-700 to-transparent" />
                            <motion.span
                                className="text-[11px] font-black text-blue-500/80 tracking-[0.4em] tabular-nums"
                            >
                                {progress.toString().padStart(3, '0')}%
                            </motion.span>
                            <div className="h-[1px] w-8 bg-gradient-to-r from-slate-700 to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Demo/Main App
export default function Wel() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30">
            <AnimatePresence>
                {isLoading && (
                    <RentEaseLoader onComplete={() => setIsLoading(false)} />
                )}
            </AnimatePresence>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <header className="flex justify-between items-center mb-24 opacity-80">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Home className="w-5 h-5" />
                        </div>
                        RentEase
                    </div>
                    <button
                        onClick={() => setIsLoading(true)}
                        className="text-sm font-medium px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
                    >
                        Replay Loader
                    </button>
                </header>

                <section className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8">
                            Rental Management<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
                                Reimagined.
                            </span>
                        </h1>
                        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-12">
                            The all-in-one platform connecting Tenants, Landlords, and Admins with seamless transparency.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <button className="px-8 py-4 bg-blue-600 rounded-2xl font-semibold shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-500 transition-all hover:scale-105 active:scale-95">
                                Browse Properties
                            </button>
                            <button className="px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl font-semibold hover:bg-white/10 transition-all">
                                List Your Property
                            </button>
                        </div>
                    </motion.div>
                </section>

                {/* Mock Dashboard Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-32 relative group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-[2rem] blur-2xl group-hover:opacity-100 transition duration-1000"></div>
                    <div className="relative bg-[#0b1121] border border-white/10 rounded-[2rem] aspect-video w-full overflow-hidden shadow-2xl flex items-center justify-center text-slate-500 italic">
                        Dashboard Preview Mockup
                    </div>
                </motion.div>
            </main>
        </div>
    );
}