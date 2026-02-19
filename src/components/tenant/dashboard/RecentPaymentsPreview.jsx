import React from 'react';
import { Check } from 'lucide-react';
import Card from '../ui/Card';
import { useTheme } from "../../../context/ThemeContext";

const RecentPaymentsPreview = ({ payments, navigate }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Recent Payments</h3>
                <button onClick={() => navigate('payments')} className="text-violet-500 hover:text-violet-400 text-sm font-medium transition-colors">View All</button>
            </div>

            <div className="space-y-4">
                {payments.slice(0, 2).map((payment) => (
                    <div key={payment.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors duration-500
                ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}>

                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                                <Check size={16} />
                            </div>
                            <div>
                                <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                                    {new Date(payment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                                <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Rent Payment</p>
                            </div>
                        </div>

                        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            ₹{payment.amount.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default RecentPaymentsPreview;
