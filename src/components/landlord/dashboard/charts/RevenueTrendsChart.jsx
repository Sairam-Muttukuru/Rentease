import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Card } from '../../../ui/card';

const RevenueTrendsChart = ({ isDarkMode, payments = [] }) => {
    // Process payments to get monthly totals
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        last6Months.push({
            month: d.toLocaleString('default', { month: 'short' }),
            monthNum: d.getMonth(),
            year: d.getFullYear(),
            amount: 0
        });
    }

    payments.forEach(p => {
        const pDate = new Date(p.date);
        const match = last6Months.find(m => m.monthNum === pDate.getMonth() && m.year === pDate.getFullYear());
        if (match) {
            match.amount += Number(p.amount);
        }
    });

    const chartData = last6Months.map(({ month, amount }) => ({ month, amount }));

    const maxAmount = Math.max(...chartData.map(d => d.amount), 5000);
    const maxVal = Math.ceil(maxAmount / 10000) * 10000 + 10000;

    const width = 600;
    const height = 300;
    const padding = 40;
    const leftPadding = 60;
    const bottomPadding = 40;

    const yAxisLabels = [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal];

    // Calculate coordinates
    const pointData = chartData.map((d, i) => {
        const x = leftPadding + (i / (chartData.length - 1)) * (width - leftPadding - padding);
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
                                    {label >= 1000 ? `${Math.round(label / 1000)}k` : Math.round(label)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Chart Line with Animated Draw Effect */}
                    <motion.polyline
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
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

                            {/* Circle Point with Individual Animation */}
                            <motion.circle
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 1.5 + (i * 0.1), duration: 0.5 }}
                                cx={p.x}
                                cy={p.y}
                                r="6"
                                className="fill-blue-500 stroke-white dark:stroke-slate-900 stroke-[3px] cursor-pointer hover:r-8 transition-all"
                            />
                        </g>
                    ))}
                </svg>
            </div>
        </Card>
    );
};

export default RevenueTrendsChart;
