import React from 'react';
import { useTheme } from "../../../context/ThemeContext";

const StatusBadge = ({ status }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    // Normalize status to Title Case for consistent styling
    const normalize = (str) => {
        if (!str) return "Open";
        if (str.toLowerCase() === 'in progress') return 'In Progress';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const normalizedStatus = normalize(status);

    const styles = {
        Paid: isDarkMode
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : "bg-emerald-100 text-emerald-700 border-emerald-200",
        Pending: isDarkMode
            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
            : "bg-amber-100 text-amber-700 border-amber-200",
        Overdue: isDarkMode
            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
            : "bg-rose-100 text-rose-700 border-rose-200",
        "In Progress": isDarkMode
            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
            : "bg-blue-100 text-blue-700 border-blue-200",
        Resolved: isDarkMode
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : "bg-emerald-100 text-emerald-700 border-emerald-200",
        Open: isDarkMode
            ? "bg-violet-500/10 text-violet-400 border-violet-500/20"
            : "bg-violet-100 text-violet-700 border-violet-200",
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border backdrop-blur-sm transition-colors duration-500 ${styles[normalizedStatus] || styles.Open}`}>
            {normalizedStatus}
        </span>
    );
};

export default StatusBadge;
