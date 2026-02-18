import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ShieldCheck, TrendingUp, Users, Wallet } from 'lucide-react';
import logo from "/favicon.png";

const LandlordLoader = ({ onComplete, isDarkMode }) => {
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);

    const statuses = [
        { text: "Securing Assets...", icon: <ShieldCheck className="w-4 h-4" /> },
        { text: "Fetching Property Data...", icon: <Building2 className="w-4 h-4" /> },
        { text: "Loading Tenant Records...", icon: <Users className="w-4 h-4" /> },
        { text: "Calculating Financials...", icon: <Wallet className="w-4 h-4" /> },
        { text: "Optimizing Portfolio...", icon: <TrendingUp className="w-4 h-4" /> }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => onComplete?.(), 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 40);

        const statusTimer = setInterval(() => {
            setStatusIndex(prev => (prev + 1) % statuses.length);
        }, 800);

        return () => {
            clearInterval(timer);
            clearInterval(statusTimer);
        };
    }, [onComplete]);

    return (
        <div className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center ${isDarkMode ? 'bg-[#020617]' : 'bg-slate-50'} overflow-hidden`}>
            {/* Background Glows */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full"
            />

            <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
                {/* Logo Section */}
                <div className="relative mb-12">
                    {/* Multi-layered Halo */}
                    <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-4 border border-dashed border-indigo-500/30 rounded-full"
                    />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative bg-white/5 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl"
                    >
                        <img
                            src={logo}
                            alt="RentEase"
                            className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                        />
                    </motion.div>
                </div>

                {/* Text Content */}
                <div className="text-center space-y-4 mb-10">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className={`text-2xl font-black tracking-widest uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                    >
                        LANDLORD<span className="text-indigo-500">PORTAL</span>
                    </motion.h2>

                    <div className="h-6 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={statusIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-2 text-indigo-500/80 font-bold text-[10px] tracking-[0.2em] uppercase"
                            >
                                {statuses[statusIndex].icon}
                                <span>{statuses[statusIndex].text}</span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Premium Progress Bar */}
                <div className="w-full space-y-4">
                    <div className="h-1.5 w-full bg-indigo-500/5 rounded-full overflow-hidden border border-white/5 backdrop-blur-sm relative">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-400"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "linear" }}
                            style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)' }}
                        />
                        {/* Shimmer */}
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full h-full"
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-slate-500 tracking-tighter">ESTABLISHING CONNECTION</span>
                        <span className="text-[10px] font-mono text-indigo-500 font-bold">{progress}%</span>
                    </div>
                </div>
            </div>

            {/* Bottom Branding */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-12 flex items-center gap-2 text-slate-500/50"
            >
                <div className="w-4 h-4 bg-indigo-500/10 rounded-sm flex items-center justify-center border border-indigo-500/20">
                    <img src={logo} className="w-2.5 h-2.5 opacity-50 grayscale" />
                </div>
                <span className="text-[8px] font-black tracking-[0.5em] uppercase">RentEase Intelligence</span>
            </motion.div>
        </div>
    );
};

export default LandlordLoader;
