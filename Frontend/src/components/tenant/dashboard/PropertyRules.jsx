import React from 'react';
import Card from '../ui/Card';
import { useTheme } from "../../../context/ThemeContext";

const PropertyRules = ({ rules }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    // Parse rules - split by newline or comma if it's a single string
    const rulesList = rules
        ? rules.split(/\r?\n/).filter(r => r.trim() !== '')
        : [
            "Please contact your landlord for specific property guidelines.",
            "Maintain cleanliness in common areas.",
            "Respect your neighbors."
        ];

    return (
        <Card className="p-6">
            <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Property Rules</h3>
            <ul className={`space-y-3 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>
                {rulesList.map((rule, index) => (
                    <li key={index} className="flex gap-3">
                        <span className="shrink-0">•</span>
                        <span>{rule.startsWith('•') ? rule.substring(1).trim() : rule}</span>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default PropertyRules;
