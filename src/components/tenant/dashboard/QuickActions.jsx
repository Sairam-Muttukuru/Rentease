import React from 'react';
import { CreditCard, Wrench, MessageSquare, Bell, FileText, Shield } from 'lucide-react';
import Card from '../ui/Card';
import { useTheme } from "../../../context/ThemeContext";

const QuickActions = ({ navigate, isPaid }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const actions = [
        {
            label: 'Pay Rent',
            icon: CreditCard,
            path: 'payments',
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            disabled: isPaid
        },
        {
            label: 'Request Service',
            icon: Wrench,
            path: 'services',
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            label: 'Raise Complaint',
            icon: MessageSquare,
            path: 'complaints',
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20'
        },
        {
            label: 'Notices',
            icon: Bell,
            path: 'notices',
            color: 'text-violet-500',
            bg: 'bg-violet-500/10',
            border: 'border-violet-500/20'
        }
    ];

    return (
        <Card className="p-6">
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={() => !action.disabled && navigate(action.path)}
                        disabled={action.disabled}
                        className={`group p-4 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden
                            ${isDarkMode
                                ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                                : 'bg-slate-50 border-slate-200 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50'}
                            ${action.disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer hover:-translate-y-1'}
                        `}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${action.bg} ${action.color}`}>
                            <action.icon size={20} />
                        </div>
                        <span className={`font-bold text-sm block ${isDarkMode ? 'text-slate-200' : 'text-slate-700'} group-hover:text-violet-500 transition-colors`}>
                            {action.label}
                        </span>
                    </button>
                ))}
            </div>
        </Card>
    );
};

export default QuickActions;
