import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from "../../../context/ThemeContext";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDarkMode = theme === 'dark';
    return (
        <button
            onClick={toggleTheme}
            className={`
        relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 hover:scale-105
        ${isDarkMode ? 'bg-slate-700 ring-offset-slate-900' : 'bg-slate-200 ring-offset-white'}
      `}
        >
            <span
                className={`
          inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-lg ring-0 transition-all duration-500 ease-in-out
          ${isDarkMode ? 'translate-x-7' : 'translate-x-1'}
        `}
            >
                <span className={`absolute transition-all duration-500 ${isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}`}>
                    <Moon size={14} className="text-violet-600" />
                </span>
                <span className={`absolute transition-all duration-500 ${!isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}>
                    <Sun size={14} className="text-orange-500" />
                </span>
            </span>
        </button>
    );
};

export default ThemeToggle;
