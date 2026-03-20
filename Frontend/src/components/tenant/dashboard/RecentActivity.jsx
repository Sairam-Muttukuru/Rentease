import React from 'react';
import Card from '../ui/Card';
import { useTheme } from "../../../context/ThemeContext";

const RecentActivity = ({ dashboardNotifications }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Activity</h3>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>Last 24h</span>
            </div>

            <div className="space-y-0">
                {dashboardNotifications.length > 0 ? (
                    dashboardNotifications.slice(0, 4).map((note, i) => (
                        <div key={i} className={`relative pl-6 pb-6 last:pb-0 border-l ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                            <div className={`absolute -left-1.5 top-0 w-3 h-3 rounded-full border-2 ${isDarkMode ? 'border-slate-900' : 'border-white'} ${note.color.replace('text-', 'bg-')}`}></div>
                            <div className="relative -top-1.5">
                                <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{note.title}</p>
                                <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{note.time}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-4 text-center">
                        <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>No recent activity</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default RecentActivity;
