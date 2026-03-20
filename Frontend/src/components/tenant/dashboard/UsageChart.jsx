import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import { useTheme } from '../../../context/ThemeContext';

const UsageChart = ({ user, isPaid, payments = [] }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Generate data starting from the lease start month
    const generateChartData = () => {
        const data = [];
        const now = new Date();
        const monthlyRent = parseFloat(user?.monthlyRent || 0);

        // Parse start date, fallback to 6 months ago if invalid
        let startDate = user?.start_date ? new Date(user.start_date) : new Date(now.getFullYear(), now.getMonth() - 5, 1);

        // Ensure startDate only contains month and year for comparison
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

        // Calculate number of months between start and now
        const monthsCount = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());

        // We show at least 6 months, but start from the actual start date if it's more or less
        // If it's more than 12 months, we show last 12 for readability, but start from lease start if it's within a year
        const displayMonths = Math.min(Math.max(monthsCount, 5), 11); // Show between 6 and 12 months

        for (let i = displayMonths; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

            // Skip months BEFORE the lease start date
            if (date < startDate) continue;

            const monthLabel = date.toLocaleString('default', { month: 'short' });

            const monthPayments = payments.filter(p => {
                const pDate = new Date(p.payment_date || p.date);
                const isSecurity = (p.receipt_number || p.receipt_no || "").startsWith('SEC-DEP');
                return !isSecurity && pDate.getMonth() === date.getMonth() && pDate.getFullYear() === date.getFullYear();
            });

            const totalPaidInMonth = monthPayments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

            let paid = totalPaidInMonth;
            let due = 0;

            if (i === 0) {
                // Current month
                if (isPaid) {
                    paid = Math.max(paid, monthlyRent);
                    due = 0;
                } else {
                    due = Math.max(0, monthlyRent - paid);
                }
            } else {
                // Past months
                due = totalPaidInMonth >= monthlyRent ? 0 : Math.max(0, monthlyRent - totalPaidInMonth);
            }

            data.push({
                month: monthLabel,
                amount: paid,
                due: due
            });
        }
        return data;
    };

    const chartData = generateChartData();

    return (
        <Card className="p-6 flex flex-col hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'bg-violet-50 text-violet-600 border border-violet-100'} shadow-sm`}>
                    <TrendingUp size={24} strokeWidth={2} />
                </div>
                <div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Payment Analytics</h3>
                    <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>6-Month Rent Activity</p>
                </div>
            </div>
            <div className={`flex-1 min-h-[300px] w-full ${isDarkMode ? 'bg-slate-900/40 border border-slate-800' : 'bg-slate-50/80 border border-slate-100'} rounded-2xl p-4 overflow-hidden`}>
                {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#e2e8f0'} />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12, fontWeight: 500 }}
                            />
                            <YAxis hide />
                            <Tooltip
                                cursor={{ fill: isDarkMode ? '#334155' : '#f1f5f9' }}
                                contentStyle={{
                                    backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    color: isDarkMode ? '#f1f5f9' : '#1e293b'
                                }}
                            />
                            <Bar dataKey="amount" name="Paid" fill="#8b5cf6" radius={[4, 4, 0, 0]} isAnimationActive={true} barSize={30} />
                            <Bar dataKey="due" name="Due" fill="#f43f5e" radius={[4, 4, 0, 0]} isAnimationActive={true} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </Card>
    );
};

export default UsageChart;
