import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card } from '../../../ui/card';

const RevenueLineChart = ({ isDarkMode }) => {
    const REVENUE_DATA = [
        { month: 'Jan', amount: 45000 },
        { month: 'Feb', amount: 52000 },
        { month: 'Mar', amount: 48000 },
        { month: 'Apr', amount: 61000 },
        { month: 'May', amount: 55000 },
        { month: 'Jun', amount: 67000 },
    ];

    const maxVal = Math.max(...REVENUE_DATA.map(d => d.amount));
    const minVal = Math.min(...REVENUE_DATA.map(d => d.amount));
    const range = maxVal - minVal;
    const width = 1000;
    const height = 300;
    const padding = 60;

    const points = REVENUE_DATA.map((d, i) => {
        const x = padding + (i * (width - 2 * padding)) / (REVENUE_DATA.length - 1);
        const y = height - padding - ((d.amount - minVal + range * 0.1) * (height - 2 * padding)) / (range * 1.2);
        return { x, y };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return (
        <Card isDarkMode={isDarkMode} className="p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                <TrendingUp size={160} className="text-violet-500" />
            </div>
            <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Revenue Gain</h3>
                    <p className="text-sm text-slate-500 font-medium">Performance tracking across properties</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Growth Rate</p>
                    <h4 className="text-2xl font-black text-emerald-400">+12.5%</h4>
                </div>
            </div>
            <div className="relative h-[300px] w-full">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible drop-shadow-2xl">
                    <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    {[0, 1, 2, 3].map(i => (
                        <line
                            key={i}
                            x1={padding}
                            y1={padding + (i * (height - 2 * padding)) / 3}
                            x2={width - padding}
                            y2={padding + (i * (height - 2 * padding)) / 3}
                            stroke={isDarkMode ? "#1e293b" : "#e2e8f0"}
                            strokeDasharray="4 4"
                        />
                    ))}
                    <path d={areaPath} fill="url(#areaGradient)" />
                    <path d={linePath} fill="none" stroke="url(#lineGradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" />
                    {points.map((p, i) => (
                        <g key={i} className="group/dot cursor-pointer">
                            <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#8b5cf6" strokeWidth="2" />
                            <text x={p.x} y={height - padding + 30} textAnchor="middle" className="text-xs font-black fill-slate-500 uppercase tracking-widest">
                                {REVENUE_DATA[i].month}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>
        </Card>
    );
};

export default RevenueLineChart;
