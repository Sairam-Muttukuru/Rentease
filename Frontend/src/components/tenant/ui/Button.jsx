import React from 'react';
import { useTheme } from "../../../context/ThemeContext";

const Button = ({ children, variant = "primary", onClick, className = "", disabled = false, icon: Icon, type = "button" }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const baseStyle = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

    const variants = {
        primary: "bg-violet-600 hover:bg-violet-700 text-white shadow-sm border border-transparent",
        secondary: isDarkMode
            ? "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700"
            : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
        danger: "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100",
        ghost: isDarkMode
            ? "bg-transparent text-slate-400 hover:text-white hover:bg-slate-800"
            : "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100",
        outline: isDarkMode
            ? "bg-transparent border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white"
            : "bg-transparent border border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-900",
        icon: "p-2 aspect-square rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
    };

    return (
        <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
            {Icon && <Icon size={18} />}
            {children}
        </button>
    );
};

export default Button;
