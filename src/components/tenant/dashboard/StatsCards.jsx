import React from 'react';
import { Home, IndianRupee, MessageSquare, Users, Wrench } from 'lucide-react';
import Card from '../ui/Card';
import { useTheme } from "../../../context/ThemeContext";

const StatsCards = ({ user, isPaid, activeComplaintsCount, serviceRequests }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Rent Status Card */}
            <Card className="p-6 flex justify-between items-center group hover:border-violet-500/50 hover:shadow-lg transition-all duration-300">
                <div>
                    <p className={`text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Rent Status</p>
                    <h3 className={`text-2xl font-bold transition-colors duration-500 ${isPaid ? 'text-emerald-400' : 'text-rose-400'} drop-shadow-sm`}>
                        {isPaid ? 'Paid' : 'Unpaid'}
                    </h3>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-110 shadow-lg
          ${isDarkMode
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-emerald-900/20'
                        : 'bg-emerald-100 text-emerald-600 border-emerald-200 shadow-emerald-100'}`}>
                    <IndianRupee size={28} className="stroke-[2.5]" />
                </div>
            </Card>

            {/* Active Services Card */}
            <Card className="p-6 flex justify-between items-center group hover:border-violet-500/50 hover:shadow-lg transition-all duration-300">
                <div>
                    <p className={`text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Active Services</p>
                    <h3 className={`text-2xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {serviceRequests ? serviceRequests.filter(req => req.status !== 'Completed' && req.status !== 'Cancelled').length : 0}
                    </h3>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-110 shadow-lg
          ${isDarkMode
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-amber-900/20'
                        : 'bg-amber-100 text-amber-600 border-amber-200 shadow-amber-100'}`}>
                    <Wrench size={28} className="stroke-[2.5]" />
                </div>
            </Card>

            {/* Active Complaints Card */}
            <Card className="p-6 flex justify-between items-center group hover:border-violet-500/50 hover:shadow-lg transition-all duration-300">
                <div>
                    <p className={`text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Active Complaints</p>
                    <h3 className={`text-2xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeComplaintsCount}</h3>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-110 shadow-lg
          ${isDarkMode
                        ? 'bg-violet-500/20 text-violet-400 border-violet-500/30 shadow-violet-900/20'
                        : 'bg-violet-100 text-violet-600 border-violet-200 shadow-violet-100'}`}>
                    <MessageSquare size={28} className="stroke-[2.5]" />
                </div>
            </Card>

            {/* Family Members Card */}
            <Card className="p-6 flex justify-between items-center group hover:border-violet-500/50 hover:shadow-lg transition-all duration-300">
                <div>
                    <p className={`text-sm font-medium mb-1 transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Family Members</p>
                    <h3 className={`text-2xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.familyMembers}</h3>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-110 shadow-lg
          ${isDarkMode
                        ? 'bg-pink-500/20 text-pink-400 border-pink-500/30 shadow-pink-900/20'
                        : 'bg-pink-100 text-pink-600 border-pink-200 shadow-pink-100'}`}>
                    <Users size={28} className="stroke-[2.5]" />
                </div>
            </Card>
        </div>
    );
};

export default StatsCards;
