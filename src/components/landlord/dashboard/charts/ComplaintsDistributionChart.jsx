import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { Card } from '../../../ui/card';

const ComplaintsDistributionChart = ({ isDarkMode, complaints = [] }) => {
    // Process complaints to get real categories and counts
    const categories = {
        'Plumbing': 0,
        'Maintenance': 0,
        'Electrical': 0,
        'Security': 0,
        'Other': 0
    };

    complaints.forEach(c => {
        const cat = c.category || 'Other';
        if (categories.hasOwnProperty(cat)) {
            categories[cat]++;
        } else {
            categories['Other']++;
        }
    });

    const data = [
        { label: "Plumbing", value: categories['Plumbing'], color: "bg-indigo-600" },
        { label: "Maintenance", value: categories['Maintenance'], color: "bg-blue-600" },
        { label: "Electrical", value: categories['Electrical'], color: "bg-violet-600" },
        { label: "Other", value: categories['Security'] + categories['Other'], color: "bg-slate-600" },
    ];

    const maxVal = Math.max(16, ...data.map(d => d.value)) + 4;
    const yAxisLabels = [0, Math.ceil(maxVal / 4), Math.ceil(maxVal / 2), Math.ceil(maxVal * 0.75), maxVal];

    return (
        <Card isDarkMode={isDarkMode} className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="text-blue-500" size={24} />
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Complaints by Type</h3>
            </div>

            <div className="flex-1 w-full relative">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-xs text-slate-400">
                    {[...yAxisLabels].reverse().map((label, i) => (
                        <div key={i} className="flex items-center w-full">
                            <span className="w-6 text-right pr-2">{label}</span>
                            <div className={`flex-1 h-[1px] border-dashed ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}></div>
                        </div>
                    ))}
                </div>

                <div className="absolute inset-0 left-8 pt-2 pb-6 flex items-end justify-around pl-4">
                    {data.map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 h-full justify-end w-full group px-2">
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 + i * 0.1 }}
                                className={`text-xs font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                            >
                                {d.value}
                            </motion.span>
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: `${(d.value / maxVal) * 85}%`, opacity: 1 }}
                                transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                                className={`w-14 rounded-t-lg transition-all duration-300 group-hover:opacity-80 group-hover:scale-x-110 ${d.color} shadow-lg`}
                            />
                            <span className={`text-[11px] font-bold mt-1 text-center whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                {d.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
                <div className="flex items-center gap-2 text-xs text-slate-500"><div className="w-3 h-3 bg-blue-600 rounded-sm"></div> Count</div>
            </div>
        </Card>
    );
};

export default ComplaintsDistributionChart;
