import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card } from '../../../ui/card';

const ComplaintsDistributionChart = ({ isDarkMode }) => {
    const data = [
        { label: "Plumbing", value: 12, color: "bg-blue-600" },
        { label: "Maintenance", value: 8, color: "bg-blue-700" },
        { label: "Other", value: 5, color: "bg-blue-800" },
    ];
    const maxVal = 16;
    const yAxisLabels = [0, 4, 8, 12, 16];

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
                        <div key={i} className="flex flex-col items-center gap-3 h-full justify-end w-full group px-2">
                            <div
                                className={`w-16 rounded-t-lg transition-all duration-500 group-hover:opacity-80 group-hover:scale-y-105 ${d.color} shadow-lg`}
                                style={{ height: `${(d.value / maxVal) * 100}%` }}
                            ></div>
                            <span className={`text-sm font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{d.label}</span>
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
