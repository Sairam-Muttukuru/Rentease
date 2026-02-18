import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card } from '../../../ui/card';

const RevenueTrendsChart = ({ isDarkMode }) => {
    const data = [
        { month: "Jan", amount: 45000 },
        { month: "Feb", amount: 52000 },
        { month: "Mar", amount: 48000 },
        { month: "Apr", amount: 61000 },
        { month: "May", amount: 55000 },
        { month: "Jun", amount: 67000 },
    ];

    const maxVal = 80000;
    const width = 600; // Increased width for better resolution
    const height = 300;
    const padding = 40;
    const leftPadding = 60; // Extra padding for Y-axis labels
    const bottomPadding = 40; // Extra padding for X-axis labels

    const yAxisLabels = [0, 20000, 40000, 60000, 80000];

    // Calculate coordinates
    const pointData = data.map((d, i) => {
        const x = leftPadding + (i / (data.length - 1)) * (width - leftPadding - padding);
        const y = height - bottomPadding - ((d.amount / maxVal) * (height - bottomPadding - padding));
        return { x, y, ...d };
    });

    const pointsStr = pointData.map(p => `${p.x},${p.y}`).join(' ');

    return (
        <Card isDarkMode={isDarkMode} className="p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-blue-500" size={24} />
                <div>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Revenue Trends</h3>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Monthly Overview</p>
                </div>
            </div>

            <div className="flex-1 w-full relative min-h-[200px]">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    {yAxisLabels.map((label, i) => {
                        const y = height - bottomPadding - ((label / maxVal) * (height - bottomPadding - padding));
                        return (
                            <g key={i}>
                                <line
                                    x1={leftPadding}
                                    y1={y}
                                    x2={width - padding}
                                    y2={y}
                                    stroke={isDarkMode ? "#334155" : "#e2e8f0"}
                                    strokeWidth="1"
                                    strokeDasharray="4 4"
                                />
                                <text
                                    x={leftPadding - 10}
                                    y={y + 4}
                                    textAnchor="end"
                                    className={`text-[12px] font-medium ${isDarkMode ? 'fill-slate-400' : 'fill-slate-500'}`}
                                >
                                    {label > 0 ? `${label / 1000}k` : 0}
                                </text>
                            </g>
                        );
                    })}

                    {/* Chart Line */}
                    <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="4"
                        points={pointsStr}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-lg"
                    />

                    {/* Data Points and X-Axis Labels */}
                    {pointData.map((p, i) => (
                        <g key={i}>
                            {/* X-Axis Label */}
                            <text
                                x={p.x}
                                y={height - 10}
                                textAnchor="middle"
                                className={`text-[14px] font-bold ${isDarkMode ? 'fill-slate-400' : 'fill-slate-500'}`}
                            >
                                {p.month}
                            </text>

                            {/* Circle Point */}
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r="6"
                                className="fill-blue-500 stroke-white stroke-[3px] cursor-pointer hover:r-8 transition-all"
                            />
                        </g>
                    ))}
                </svg>
            </div>
        </Card>
    );
};

export default RevenueTrendsChart;
