import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MapPin } from 'lucide-react';
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

    const vWidth = 800;
    const vHeight = 400;
    const paddingRight = 60;
    const paddingLeft = 80;
    const paddingTop = 60;
    const paddingBottom = 60;

    const chartHeight = vHeight - paddingTop - paddingBottom;
    const chartWidth = vWidth - paddingLeft - paddingRight;

    const yAxisLabels = [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal];

    // Calculate Coordinates
    const pointData = chartData.map((d, i) => {
        const x = paddingLeft + (i / (chartData.length - 1)) * chartWidth;
        const y = vHeight - paddingBottom - ((d.amount / maxVal) * chartHeight);
        return { x, y, ...d };
    });

    // Create Path using Cubic Bezier
    const createPath = () => {
        if (pointData.length === 0) return "";
        let path = `M ${pointData[0].x},${pointData[0].y}`;
        
        for (let i = 0; i < pointData.length - 1; i++) {
            const curr = pointData[i];
            const next = pointData[i + 1];
            
            // Smoothing points
            const cp1x = curr.x + (next.x - curr.x) / 2;
            const cp2x = curr.x + (next.x - curr.x) / 2;
            
            path += ` C ${cp1x},${curr.y} ${cp2x},${next.y} ${next.x},${next.y}`;
        }
        return path;
    };

    const linePath = createPath();
    const areaPath = `${linePath} L ${pointData[pointData.length - 1].x},${vHeight - paddingBottom} L ${pointData[0].x},${vHeight - paddingBottom} Z`;

    return (
        <Card isDarkMode={isDarkMode} className="p-8 h-full flex flex-col border-violet-500/10 shadow-2xl relative group overflow-hidden">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-violet-600/10 text-violet-500 ring-1 ring-violet-500/20">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <h3 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Revenue Trends</h3>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Monthly Financial Pulse</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest ring-1 ring-emerald-500/20">
                        +12.5% vs Prev Month
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full min-h-[250px] relative">
                <svg viewBox={`0 0 ${vWidth} ${vHeight}`} className="w-full h-full" overflow="visible" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="linePulse" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="50%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Grid Lines */}
                    {yAxisLabels.map((label, i) => {
                        const y = vHeight - paddingBottom - ((label / maxVal) * chartHeight);
                        return (
                            <g key={i}>
                                <line
                                    x1={paddingLeft}
                                    y1={y}
                                    x2={vWidth - paddingRight}
                                    y2={y}
                                    stroke={isDarkMode ? "#1e293b" : "#f1f5f9"}
                                    strokeWidth="1.5"
                                    strokeDasharray="10 10"
                                />
                                <text
                                    x={paddingLeft - 20}
                                    y={y + 5}
                                    textAnchor="end"
                                    className={`text-[13px] font-black ${isDarkMode ? 'fill-slate-600' : 'fill-slate-400'}`}
                                >
                                    ₹{label >= 1000 ? `${Math.round(label / 1000)}k` : Math.round(label)}
                                </text>
                            </g>
                        );
                    })}

                    {/* X-Axis Month Labels */}
                    {pointData.map((p, i) => (
                        <text
                            key={`month-${i}`}
                            x={p.x}
                            y={vHeight - 15}
                            textAnchor="middle"
                            className={`text-[12px] font-black uppercase tracking-widest ${hoveredPoint === i ? 'fill-violet-400' : (isDarkMode ? 'fill-slate-500' : 'fill-slate-400')}`}
                            style={{ transition: 'all 0.3s' }}
                        >
                            {p.month}
                        </text>
                    ))}

                    {/* Selection Indicator Line */}
                    {hoveredPoint !== null && (
                        <motion.line
                            x1={pointData[hoveredPoint].x}
                            y1={paddingTop}
                            x2={pointData[hoveredPoint].x}
                            y2={vHeight - paddingBottom}
                            stroke={isDarkMode ? "#334155" : "#e2e8f0"}
                            strokeWidth="2"
                            strokeDasharray="4 4"
                        />
                    )}

                    {/* Area Fill */}
                    <motion.path
                        d={areaPath}
                        fill="url(#areaGradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />

                    {/* Smooth Curve Line */}
                    <motion.path
                        d={linePath}
                        fill="none"
                        stroke="url(#linePulse)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />

                    {/* Interactive Points */}
                    {pointData.map((p, i) => (
                        <g 
                            key={i}
                            onMouseEnter={() => setHoveredPoint(i)}
                            onMouseLeave={() => setHoveredPoint(null)}
                            className="cursor-pointer"
                        >
                            {/* Pulse for hover */}
                            {hoveredPoint === i && (
                                <motion.circle
                                    initial={{ r: 6, opacity: 0.8 }}
                                    animate={{ r: 24, opacity: 0 }}
                                    transition={{ repeat: Infinity, duration: 1.2 }}
                                    cx={p.x}
                                    cy={p.y}
                                    fill="#a855f7"
                                />
                            )}

                            {/* Main Point */}
                            <motion.circle
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 1.5 + (i * 0.1) }}
                                cx={p.x}
                                cy={p.y}
                                r={hoveredPoint === i ? "11" : "7"}
                                fill={hoveredPoint === i ? "#ffffff" : "#a855f7"}
                                stroke={hoveredPoint === i ? "#a855f7" : "#ffffff"}
                                strokeWidth="4"
                                style={{ transition: 'all 0.3s' }}
                            />

                            {/* Floating Glassmorphism Tooltip Render */}
                            <foreignObject 
                                x={p.x - 70} 
                                y={p.y - 95} 
                                width="140" 
                                height="80" 
                                className={`transition-all duration-300 pointer-events-none ${hoveredPoint === i ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'}`}
                            >
                                <div className={`p-3 rounded-2xl shadow-2xl border text-center ${isDarkMode ? 'bg-slate-950/80 border-slate-700 backdrop-blur-md' : 'bg-white/90 border-slate-200'}`}>
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{p.month} REVENUE</p>
                                    <p className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{p.amount.toLocaleString()}</p>
                                </div>
                            </foreignObject>

                            {/* Expanded Touch/Hover Area */}
                            <circle cx={p.x} cy={p.y} r="40" fill="transparent" />
                        </g>
                    ))}
                </svg>
            </div>
            
            <div className={`mt-8 pt-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'} flex items-center justify-between`}>
                <div className="flex gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.5)]"></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Cumulative Revenue</span>
                    </div>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-violet-500 hover:text-violet-400 transition-all flex items-center gap-2 group">
                    View Financial Logs <TrendingUp size={12} className="group-hover:translate-x-1 duration-300 transition-transform" />
                </button>
            </div>
        </Card>
    );
};

export default RevenueTrendsChart;
