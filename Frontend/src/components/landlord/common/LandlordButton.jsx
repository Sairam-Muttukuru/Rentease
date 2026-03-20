import React from 'react';

const Button = ({ children, onClick, className = "", variant = "primary", icon: Icon, isDarkMode, type = "button", disabled = false, ...props }) => {
    const baseStyles = "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20",
        secondary: isDarkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
        outline: isDarkMode ? "border border-slate-700 text-slate-300 hover:bg-slate-800" : "border border-slate-200 text-slate-600 hover:bg-slate-50",
        ghost: "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {Icon && <Icon size={18} />}
            {children}
        </button>
    );
};

export default Button;
