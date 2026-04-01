import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Database, Lock, Globe, Zap } from 'lucide-react';
import logo from "/favicon.png";

const AdminLoader = ({ onComplete, isDarkMode }) => {
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);

    const statuses = [
        { text: "Initializing Admin Core...", icon: <ShieldAlert className="w-4 h-4" /> },
        { text: "Loading Global Metrics...", icon: <Globe className="w-4 h-4" /> },
        { text: "Securing Access Logs...", icon: <Lock className="w-4 h-4" /> },
        { text: "Synchronizing Database...", icon: <Database className="w-4 h-4" /> },
        { text: "Activating Control Panel...", icon: <Zap className="w-4 h-4" /> }
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
        <div className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center ${isDarkMode ? 'bg-[#0f172a]' : 'bg-slate-50'} overflow-hidden`}>
            {/* Background Glows */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/20 blur-[120px] rounded-full"
            />

            <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
                {/* Logo Section */}
                <div className="relative mb-12">
                    {/* Multi-layered Halo */}
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-0 bg-cyan-500/20 rounded-full blur-[80px]"
                    />
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative z-20"
                    >
                        <motion.img
                            animate={{
                                y: [0, -20, 0],
                                filter: ["drop-shadow(0 0 25px rgba(6,182,212,0.4))", "drop-shadow(0 0 60px rgba(6,182,212,0.8))", "drop-shadow(0 0 25px rgba(6,182,212,0.4))"]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            src={logo}
                            alt="RentEase"
                            className="w-64 h-64 object-contain"
                        />
                    </motion.div>
                </div>

                {/* Text Content */}
                <div className="text-center space-y-4 mb-10">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className={`text-4xl font-black tracking-[0.4em] uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'} drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]`}
                    >
                        SYSTEM<span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">ADMIN</span>
                    </motion.h2>

                    <div className="h-8 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={statusIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center gap-3 text-cyan-500 font-black text-sm tracking-[0.25em] uppercase"
                            >
                                <span className="p-1.5 bg-cyan-500/20 rounded-lg">{statuses[statusIndex].icon}</span>
                                <span>{statuses[statusIndex].text}</span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Premium Progress Bar */}
                <div className="w-full space-y-4">
                    <div className="h-1.5 w-full bg-cyan-500/5 rounded-full overflow-hidden border border-white/5 backdrop-blur-sm relative">
                        <motion.div
                            className="h-full bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-400"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "linear" }}
                            style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.6)' }}
                        />
                        {/* Shimmer */}
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-full h-full"
                        />
                    </div>

                    <div className="flex justify-between items-center px-1">
                        <span className="text-xs font-black text-slate-400 tracking-widest uppercase">ELEVATING PRIVILEGES</span>
                        <span className="text-sm font-black text-cyan-500 tracking-tighter">{progress}%</span>
                    </div>
                </div>
            </div>

            {/* Bottom Branding */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-12 flex flex-col items-center gap-3"
            >
                <div className="flex items-center gap-3 text-slate-400">
                    <div className="w-6 h-6 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
                        <img src={logo} className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black tracking-[0.6em] uppercase text-slate-300">RentEase Security Central</span>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLoader;
