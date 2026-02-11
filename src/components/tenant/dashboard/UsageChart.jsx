import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../ui/Card';
import { useTheme } from "../../../context/ThemeContext";

const UsageChart = ({ user, isPaid }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    return (
        <Card className="p-6">
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Payment Overview</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                        { month: 'Aug', amount: user.monthlyRent },
                        { month: 'Sep', amount: user.monthlyRent },
                        { month: 'Oct', amount: user.monthlyRent },
                        { month: 'Nov', amount: user.monthlyRent },
                        { month: 'Dec', amount: user.monthlyRent },
                        { month: 'Jan', amount: isPaid ? user.monthlyRent : 0, due: isPaid ? 0 : user.monthlyRent }
                    ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b' }} />
                        <YAxis hide />
                        <Tooltip
                            cursor={{ fill: isDarkMode ? '#334155' : '#f1f5f9' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="amount" name="Paid" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="due" name="Due" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default UsageChart;
