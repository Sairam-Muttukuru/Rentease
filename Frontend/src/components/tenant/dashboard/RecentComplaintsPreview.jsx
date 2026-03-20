import React from 'react';
import { MessageSquare, ChevronRight } from 'lucide-react';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';
import { useTheme } from "../../../context/ThemeContext";

const RecentComplaintsPreview = ({ complaints, navigate }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    return (
        <div>
            <div className="flex justify-between items-end mb-4">
                <h3 className={`text-xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Complaints</h3>
                <button onClick={() => navigate('complaints')} className="text-violet-500 hover:text-violet-400 text-sm font-medium transition-colors">View All</button>
            </div>
            <div className="grid gap-4">
                {complaints.slice(0, 2).map((req) => (
                    <Card key={req.id} className={`p-6 flex items-center justify-between cursor-pointer group hover:bg-opacity-80`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-lg transition-colors duration-500 border ${isDarkMode ? 'bg-slate-800 text-slate-400 group-hover:text-violet-400 group-hover:bg-violet-500/10 border-slate-700' : 'bg-slate-100 text-slate-500 group-hover:text-violet-600 group-hover:bg-violet-50 border-slate-200'}`}>
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <p className={`font-semibold transition-colors duration-500 ${isDarkMode ? 'text-slate-200 group-hover:text-white' : 'text-slate-900 group-hover:text-violet-700'}`}>{req.title}</p>
                                <p className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{req.date}</p>
                            </div>
                        </div>
                        <StatusBadge status={req.status} />
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default RecentComplaintsPreview;
