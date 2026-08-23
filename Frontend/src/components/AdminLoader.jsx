import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Database, Lock, Globe, Zap } from 'lucide-react';
const logo = "/favicon.png";

const AdminLoader = ({ onComplete, isDarkMode }) => {
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);

    const statuses = [
        { text: "Initializing Security Central...", icon: <ShieldAlert className="w-4 h-4" /> },
        { text: "Accessing Global Metrics...", icon: <Globe className="w-4 h-4" /> },
        { text: "Securing Audit Trails...", icon: <Lock className="w-4 h-4" /> },
        { text: "Synchronizing Core Database...", icon: <Database className="w-4 h-4" /> },
        { text: "Loading Privilege Hierarchy...", icon: <Zap className="w-4 h-4" /> }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => onComplete?.(), 600);
                    return 100;
                }
                return prev + 1.5;
            });
        }, 30);

        const statusTimer = setInterval(() => {
            setStatusIndex(prev => (prev + 1) % statuses.length);
        }, 1200);

        return () => {
            clearInterval(timer);
            clearInterval(statusTimer);
        };
    }, [onComplete]);

    const theme = {
        bg: isDarkMode ? 'bg-[#050505]' : 'bg-white',
        textMain: isDarkMode ? 'from-white via-slate-200 to-slate-400' : 'from-slate-900 via-slate-800 to-slate-900',
        accent: 'text-indigo-500',
        muted: isDarkMode ? 'text-slate-500' : 'text-slate-400'
    };

    return (
        <div className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center ${theme.bg} overflow-hidden`}>
            {/* Ambient Background */}
            {isDarkMode && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[160px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[160px]" />
                </div>
            )}

            <div className="relative z-10 flex flex-col items-center max-w-md w-full px-10">
                {/* Logo Section */}
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="relative mb-24"
                >
                    <div className="relative">
                        {isDarkMode && (
                            <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full scale-150" />
                        )}
                        <img
                            src={logo}
                            alt="RentEase"
                            className="w-48 h-48 object-contain relative z-10"
                        />
                    </div>
                </motion.div>

                {/* Text Content */}
                <div className="text-center w-full mb-12">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className={`text-4xl font-black tracking-[0.3em] uppercase text-transparent bg-clip-text bg-gradient-to-b ${theme.textMain} leading-tight`}>
                            SYSTEM<span className="text-indigo-500">ADMIN</span>
                        </h2>
                    </motion.div>

                    <div className="h-6 mt-4">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={statusIndex}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]"
                            >
                                {statuses[statusIndex].text}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Refined Loader */}
                <div className="w-full max-w-xs space-y-4">
                    <div className="h-[2px] w-full bg-slate-200 dark:bg-zinc-800/50 rounded-full overflow-hidden relative">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-indigo-500"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "linear" }}
                        />
                    </div>
                    <div className="flex justify-between items-center px-1">
                        <span className={`text-[9px] font-black tracking-[0.3em] uppercase ${theme.muted}`}>Elevating Privileges</span>
                        <span className="text-xs font-black text-indigo-500">{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>

            {/* Bottom Branding */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 1 }}
                className="absolute bottom-12 flex flex-col items-center gap-3"
            >
                <div className="flex items-center gap-4 text-slate-500">
                    <span className={`text-[10px] font-black tracking-[0.4em] uppercase ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>RentEase Secure Central</span>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLoader;
