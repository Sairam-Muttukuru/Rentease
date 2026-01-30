import React from 'react';

export const Card = ({ children, className = "", isDarkMode, ...props }) => (
    <div
        {...props}
        className={`
    backdrop-blur-md rounded-2xl shadow-xl border transition-all duration-500 ease-in-out
    ${isDarkMode
                ? 'bg-slate-900/80 border-slate-800'
                : 'bg-white border-slate-200 shadow-slate-200/50'} 
    ${className}
  `}>
        {children}
    </div>
);
