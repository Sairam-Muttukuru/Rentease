import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const logo = "/favicon.png";

const PreLoader = ({ userName, isDarkMode, role = 'Resident' }) => {
    const firstName = userName ? userName.split(' ')[0] : role;

// Theme configuration - ultra-crisp for white mode, elite for dark
    const theme = {
        bg: isDarkMode ? 'bg-[#050505]' : 'bg-white',
        textMain: isDarkMode 
            ? 'from-white via-slate-200 to-slate-400' 
            : 'from-slate-900 via-slate-800 to-slate-900',
        textSub: isDarkMode ? 'text-indigo-400' : 'text-indigo-600',
        textMuted: isDarkMode ? 'text-slate-500' : 'text-slate-400',
        progressBg: isDarkMode ? 'bg-zinc-900/50' : 'bg-slate-100',
        indicator: isDarkMode ? 'bg-indigo-500' : 'bg-indigo-600',
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${theme.bg} transition-colors duration-1000`}
        >
            {/* Ambient Background - ONLY IN DARK MODE (Very subtle) */}
            {isDarkMode && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[160px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[160px]" />
                </div>
            )}

            <div className="relative flex flex-col items-center max-w-lg w-full px-6">
                
                {/* Logo Container with Refined Animation */}
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative mb-20"
                >
                    {/* Dark Mode ONLY Glow */}
                    {isDarkMode && (
                        <div className="absolute inset-0 bg-indigo-500/10 blur-[80px] rounded-full scale-150" />
                    )}
                    
                    <div className="relative overflow-hidden rounded-[2.5rem]">
                        <motion.img
                            src={logo}
                            className="w-40 h-40 md:w-48 md:h-48 object-contain relative z-10"
                            animate={{ 
                                y: [0, -10, 0],
                            }}
                            transition={{ 
                                duration: 5, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                            }}
                        />
                        {/* Shimmer overlay on logo */}
                        <motion.div 
                            className="absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/20 to-transparent w-full h-full"
                            animate={{ x: ['-200%', '200%'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
                        />
                    </div>
                </motion.div>

                {/* Typography Section */}
                <div className="text-center w-full">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <h1 className={`text-4xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b ${theme.textMain} mb-3`}>
                            Welcome
                        </h1>
                        
                        {userName && (
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className={`text-lg md:text-xl font-bold tracking-tight ${theme.textSub} mb-16 opacity-80`}
                            >
                                {userName.toUpperCase()}
                            </motion.p>
                        )}
                    </motion.div>

                    {/* Elite Loading Indicator */}
                    <div className="flex flex-col items-center space-y-8">
                        <div className="flex flex-col items-center gap-4">
                             <div className="flex gap-1.5">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ 
                                            scale: [1, 1.2, 1], 
                                            opacity: [0.2, 0.8, 0.2] 
                                        }}
                                        transition={{ 
                                            duration: 1.5, 
                                            repeat: Infinity, 
                                            delay: i * 0.25 
                                        }}
                                        className={`w-1 h-1 rounded-full ${theme.indicator}`}
                                    />
                                ))}
                            </div>
                            <motion.span 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className={`text-[9px] font-black uppercase tracking-[0.5em] ${theme.textMuted} ml-[0.5em]`}
                            >
                                Loading Dashboard
                            </motion.span>
                        </div>

                        {/* Ultra-Thin Horizontal Loading Line */}
                        <div className={`w-32 h-[1px] ${theme.progressBg} relative`}>
                            <motion.div
                                initial={{ left: "-100%" }}
                                animate={{ left: "100%" }}
                                transition={{ 
                                    duration: 2, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                                className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform Branding */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 2 }}
                className={`absolute bottom-10 left-0 right-0 text-center text-[9px] font-bold tracking-[0.2em] uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
            >
                RentEase Platform • Secure Access
            </motion.div>
        </motion.div>
    );
};

export default PreLoader;
