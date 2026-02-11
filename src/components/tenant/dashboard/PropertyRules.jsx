import React from 'react';
import Card from '../ui/Card';
import { useTheme } from "../../../context/ThemeContext";

const PropertyRules = () => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    return (
        <Card className="p-6">
            <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Property Rules</h3>
            <ul className={`space-y-3 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                <li className="flex gap-3">
                    <span className="shrink-0">•</span>
                    <span>Quiet hours are from 10:00 PM to 7:00 AM.</span>
                </li>
                <li className="flex gap-3">
                    <span className="shrink-0">•</span>
                    <span>Waste must be segregated into wet and dry bins.</span>
                </li>
                <li className="flex gap-3">
                    <span className="shrink-0">•</span>
                    <span>Guest parking is available for up to 24 hours.</span>
                </li>
            </ul>
        </Card>
    );
};

export default PropertyRules;
