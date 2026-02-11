import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useTheme } from "../../../context/ThemeContext";

const VacateCard = () => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    return (
        <Card className="p-6 border-l-4 border-l-orange-500">
            <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Planning to Move Out?</h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-800'}`}>
                Please submit a formal notice at least 30 days in advance.
            </p>
            <Button variant="outline" className="w-full text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300 dark:border-orange-900/50 dark:text-orange-400 dark:hover:bg-orange-900/10">
                Request to Vacate
            </Button>
        </Card>
    );
};

export default VacateCard;
