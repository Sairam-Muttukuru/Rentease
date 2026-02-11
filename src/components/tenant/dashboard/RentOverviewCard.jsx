import React from 'react';
import { Clock, AlertCircle, CreditCard } from 'lucide-react';
import Button from '../ui/Button';
import { useTheme } from "../../../context/ThemeContext";

const RentOverviewCard = ({ isPaid, isOverdue, currentRentDue, nextDueDateDisplay, setPaymentType, setShowPaymentModal }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    if (isPaid) return null;

    return (
        <div className={`p-6 rounded-2xl border transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group shadow-lg
    ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}
    ${isOverdue ? 'border-rose-500/30' : 'border-violet-200'}`}>

            {/* Decorative bg element */}
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-20 ${isOverdue ? 'bg-rose-500' : 'bg-violet-500'}`}></div>

            <div className="flex items-center gap-6 z-10">
                <div className={`p-4 rounded-2xl shadow-inner shrink-0 ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'} ${isOverdue ? 'text-rose-500' : 'text-violet-600'}`}>
                    {isOverdue ? <AlertCircle size={32} /> : <Clock size={32} />}
                </div>
                <div>
                    <h4 className={`font-bold text-2xl mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {isOverdue ? 'Attention: Rent Overdue' : 'Upcoming Payment'}
                    </h4>
                    <div className="flex flex-col gap-1">
                        <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} font-medium`}>
                            Total Outstanding: <span className={`text-xl font-bold ${isOverdue ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>₹{currentRentDue.toLocaleString()}</span>
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm opacity-80 mt-1">
                            <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Due By: <span className="font-semibold">{nextDueDateDisplay}</span></span>
                            {isOverdue && <span className="text-rose-500 font-bold">• Immediate Action Required</span>}
                        </div>
                    </div>
                </div>
            </div>

            <Button
                onClick={() => {
                    setPaymentType('RENT');
                    setShowPaymentModal(true);
                }}
                className={`z-10 px-8 py-3 text-lg shadow-xl whitespace-nowrap ${isOverdue ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20' : ''}`}
                icon={CreditCard}
            >
                {isOverdue ? 'Pay Dues Now' : 'Pay Rent'}
            </Button>
        </div>
    );
};

export default RentOverviewCard;
