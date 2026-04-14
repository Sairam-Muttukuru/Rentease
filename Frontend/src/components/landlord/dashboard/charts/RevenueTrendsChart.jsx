import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Card } from '../../../ui/card';

const RevenueTrendsChart = ({ isDarkMode, payments = [] }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);

    // Process payments to get monthly totals
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setDate(1); 
        d.setMonth(d.getMonth() - i);
        last6Months.push({
            month: d.toLocaleString('default', { month: 'short' }),
            monthNum: d.getMonth(),
            year: d.getFullYear(),
            amount: 0
        });
    }

    payments.forEach(p => {
        let pMonth, pYear;
        if (p.local_date) {
            const parts = p.local_date.split('-');
            pYear = parseInt(parts[0]);
            pMonth = parseInt(parts[1]) - 1;
        } else {
            const pDate = new Date(p.date || p.payment_date);
            pMonth = pDate.getMonth();
            pYear = pDate.getFullYear();
        }
        
        const match = last6Months.find(m => m.monthNum === pMonth && m.year === pYear);
        if (match) {
            match.amount += Number(p.amount);
        }
    });

    const chartData = last6Months.map(({ month, amount }) => ({ month, amount }));
    const maxAmount = Math.max(...chartData.map(d => d.amount), 5000);
    const maxVal = Math.ceil(maxAmount / 10000) * 10000 + 10000;

    const width = 800;
    const height = 400;
    const padding = 60;
    const leftPadding = 80;
    const bottomPadding = 60;

    const yAxisLabels = [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal];

    // Calculate coordinates
    const pointData = chartData.map((d, i) => {
        const x = leftPadding + (i / (chartData.length - 1)) * (width - leftPadding - padding);
        const y = height - bottomPadding - ((d.amount / maxVal) * (height - bottomPadding - padding));
        return { x, y, ...d };
    });

    // Helper functions for Bezier curves
    const getCommand = (point, i, a) => {
        if (i === 0) return `M ${point.x},${point.y}`;
        
        // Smoothing algorithm
        const smoothing = 0.15;
        const prev = a[i - 1];
        const next = a[i + 1] || point;
        const prevPrev = a[i - 2] || prev;
        
        const cp1x = prev.x + (point.x - prevPrev.x) * smoothing;
        const cp1y = prev.y + (point.y - prevPrev.y) * smoothing;
        const cp2x = point.x - (next.x - prev.x) * smoothing;
        const cp2y = point.y - (next.y - prev.y) * smoothing;
        
        return `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
    };

    const linePath = pointData.reduce((acc, point, i, a) => acc + ' ' + getCommand(point, i, a), '');
    
    // Create fill path (closing the loop at the bottom)
    const fillPath = `${linePath} L ${pointData[pointData.length - 1].x},${height - bottomPadding} L ${pointData[0].x},${height - bottomPadding} Z`;

    return (
        <Card isDarkMode={isDarkMode} className="p-8 h-full flex flex-col border-violet-500/10 shadow-2xl overflow-hidden group">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-violet-600/10 text-violet-500">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <h3 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Revenue Trends</h3>
                        <p className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Performance Analysis</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wider">
                        +12.5% vs Prev Month
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full relative">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.01" />
                        </linearGradient>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#4f46e5" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

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
                                    stroke={isDarkMode ? "#1e293b" : "#f1f5f9"}
                                    strokeWidth="1.5"
                                    strokeDasharray="8 8"
                                />
                                <text
                                    x={leftPadding - 20}
                                    y={y + 5}
                                    textAnchor="end"
                                    className={`text-[13px] font-black ${isDarkMode ? 'fill-slate-600' : 'fill-slate-400'}`}
                                >
                                    ₹{label >= 1000 ? `${Math.round(label / 1000)}k` : Math.round(label)}
                                </text>
                            </g>
                        );
                    })}

                    {/* Vertical Grid Lines */}
                    {pointData.map((p, i) => (
                        <line
                            key={`vgrid-${i}`}
                            x1={p.x}
                            y1={height - bottomPadding}
                            x2={p.x}
                            y2={padding}
                            stroke={hoveredPoint === i ? (isDarkMode ? "#334155" : "#e2e8f0") : "transparent"}
                            strokeWidth="1"
                            strokeDasharray="4 4"
                            className="transition-all duration-300"
                        />
                    ))}

                    {/* Filled Area */}
                    <motion.path
                        d={fillPath}
                        fill="url(#areaGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                    />

                    {/* Main Curve Line */}
                    <motion.path
                        d={linePath}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                    />

                    {/* Data Points and Interactivity */}
                    {pointData.map((p, i) => (
                        <g 
                            key={i}
                            onMouseEnter={() => setHoveredPoint(i)}
                            onMouseLeave={() => setHoveredPoint(null)}
                            className="cursor-pointer"
                        >
                            <text
                                x={p.x}
                                y={height - 20}
                                textAnchor="middle"
                                className={`text-[12px] font-black uppercase tracking-tighter ${hoveredPoint === i ? 'fill-white' : (isDarkMode ? 'fill-slate-500' : 'fill-slate-400')}`}
                                style={{ transition: 'all 0.3s' }}
                            >
                                {p.month}
                            </text>

                            {/* Outer Pulseing Halo */}
                            {hoveredPoint === i && (
                                <motion.circle
                                    initial={{ r: 8, opacity: 0.5 }}
                                    animate={{ r: 18, opacity: 0 }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    cx={p.x}
                                    cy={p.y}
                                    fill="#8b5cf6"
                                />
                            )}

                            {/* Main Node */}
                            <motion.circle
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 2 + (i * 0.1) }}
                                cx={p.x}
                                cy={p.y}
                                r={hoveredPoint === i ? "10" : "5"}
                                fill={hoveredPoint === i ? "#ffffff" : "#8b5cf6"}
                                stroke={hoveredPoint === i ? "#8b5cf6" : "#ffffff"}
                                strokeWidth="3"
                                className="shadow-xl"
                                style={{ transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                            />

                            {/* Floating Tooltip */}
                            <foreignObject 
                                x={p.x - 75} 
                                y={p.y - 85} 
                                width="150" 
                                height="70" 
                                className={`transition-all duration-500 ${hoveredPoint === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                            >
                                <div className={`p-3 rounded-2xl shadow-2xl border text-center ${isDarkMode ? 'bg-slate-900/90 border-slate-700 backdrop-blur-md' : 'bg-white/90 border-slate-200'}`}>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{p.month} Revenue</p>
                                    <p className={`text-lg font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{p.amount.toLocaleString()}</p>
                                </div>
                            </foreignObject>

                            {/* Expanded hit area */}
                            <circle cx={p.x} cy={p.y} r="40" fill="transparent" />
                        </g>
                    ))}
                </svg>
            </div>
            
            <div className={`mt-8 pt-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'} flex items-center justify-between`}>
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
                        <span className={`text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Total Earnings</span>
                    </div>
                </div>
                <button className="text-[11px] font-black uppercase tracking-widest text-violet-500 hover:text-violet-400 transition-colors">
                    Download Full Report
                </button>
            </div>
        </Card>
    );
};

export default RevenueTrendsChart;
