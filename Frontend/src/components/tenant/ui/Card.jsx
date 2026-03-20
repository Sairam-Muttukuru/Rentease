import React from 'react';
import { useTheme } from "../../../context/ThemeContext";

const Card = ({ children, className = "", onClick }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    return (
        <div
            onClick={onClick}
            className={`
      rounded-lg border transition-all duration-300
      ${isDarkMode
                    ? 'bg-slate-900 border-slate-700'
                    : 'bg-white border-slate-200 shadow-sm'} 
      ${className}
    `}>
            {children}
        </div>
    );
};

export default Card;
