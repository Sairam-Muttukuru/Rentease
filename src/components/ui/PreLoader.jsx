import React from 'react';
import { motion } from 'framer-motion';
import logo from "/favicon.png";

const PreLoader = ({ userName, isDarkMode }) => {
    // Split name to get first name for a more personal touch
    const firstName = userName ? userName.split(' ')[0] : 'Tenant';

    // Theme configuration
    const theme = {
        bg: isDarkMode ? 'bg-zinc-950' : 'bg-slate-50',
        blob1: isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-400/20',
        blob2: isDarkMode ? 'bg-violet-500/10' : 'bg-purple-400/20',
        iconBg: isDarkMode ? 'bg-zinc-900/50 border-white/10' : 'bg-white/80 border-indigo-100',
        iconColor: isDarkMode ? 'text-white' : 'text-indigo-600',
        textMain: isDarkMode ? 'from-white via-indigo-100 to-indigo-400' : 'from-slate-900 via-indigo-800 to-indigo-600',
        textSub: isDarkMode ? 'text-indigo-300' : 'text-indigo-600',
        textMuted: isDarkMode ? 'text-indigo-200/90' : 'text-slate-500',
        progressBg: isDarkMode ? 'bg-zinc-900' : 'bg-slate-200',
        shadow: isDarkMode ? 'shadow-2xl' : 'shadow-xl shadow-indigo-100/50',
        keyBg: isDarkMode ? 'bg-indigo-500' : 'bg-indigo-600',
        glow: isDarkMode ? 'opacity-20 blur-lg' : 'opacity-30 blur-xl',
    };

    return (
        <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center ${theme.bg} transition-colors duration-500`}>

            {/* Soft Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-[20%] left-[20%] w-[50%] h-[50%] ${theme.blob1} rounded-full blur-[100px] animate-pulse`} />
                <div className={`absolute bottom-[20%] right-[20%] w-[50%] h-[50%] ${theme.blob2} rounded-full blur-[100px] animate-pulse delay-700`} />
            </div>

            <div className="relative flex flex-col items-center justify-center space-y-8">

                {/* Animated Home Icon */}
                <div className="relative group">
                    <div className={`absolute -inset-4 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full ${theme.glow} group-hover:opacity-40 transition-opacity duration-1000 animate-pulse`}></div>
                    <div className="relative group">
                        <img
                            src={logo}
                            className="w-56 h-56 object-contain drop-shadow-[0_0_30px_rgba(99,102,241,0.5)] animate-pulse [animation-duration:4s]"
                            alt="RentEase"
                        />

                        {/* Key Element Animation */}
                        <div className={`absolute -bottom-2 -right-2 ${theme.keyBg} p-2 rounded-full shadow-lg animate-bounce [animation-duration:3s]`}>
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 11l-4.498 4.498a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.242-2.242a1 1 0 010-1.414l.707-.707a1 1 0 011.414 0l.707.707 3.172-3.172a6 6 0 015.743-7.744A2 2 0 0115 7z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="text-center space-y-3 z-10 px-4">
                    <div className="overflow-hidden">
                        <h1 className={`text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${theme.textMain} tracking-tight animate-fade-in-up`}>
                            Welcome Home{userName ? ',' : ''}
                        </h1>
                    </div>

                    {userName && (
                        <h2 className={`text-2xl md:text-3xl font-light ${theme.textSub} animate-fade-in-up delay-150`}>
                            {firstName}
                        </h2>
                    )}

                    <div className={`flex items-center justify-center gap-3 mt-6 ${theme.textMuted} text-base font-black tracking-widest uppercase animate-fade-in-up delay-300`}>
                        <span className={`w-2.5 h-2.5 ${isDarkMode ? 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]' : 'bg-indigo-600'} rounded-full animate-pulse`}></span>
                        <span>Preparing your dashboard</span>
                        <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
                        >...</motion.span>
                    </div>
                </div>

            </div>

            {/* Progress Line */}
            <div className={`absolute bottom-0 left-0 w-full h-1 ${theme.progressBg}`}>
                <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 w-1/2 animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>

            <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        .delay-150 { animation-delay: 150ms; }
        .delay-300 { animation-delay: 300ms; }
        
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
        </div>
    );
};

export default PreLoader;
