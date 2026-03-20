import React from 'react';
import { User, Shield, Phone, MessageCircle } from 'lucide-react';
import Card from '../ui/Card';
import { useTheme } from "../../../context/ThemeContext";

const ImportantContacts = ({ user }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    return (
        <Card className="p-6">
            <h3 className={`text-xl font-bold mb-4 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Important Contacts</h3>
            <div className="space-y-4">
                <div className={`p-3 rounded-xl flex items-center gap-4 transition-colors duration-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className={`p-3 rounded-full shadow-md ${isDarkMode ? 'bg-violet-500/20 text-violet-400 shadow-violet-900/10' : 'bg-white text-violet-600 shadow-violet-100'}`}>
                        <User size={24} className="stroke-[2.5]" />
                    </div>
                    <div>
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.landlord || "Landlord"}</p>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Property Manager</p>
                    </div>
                </div>

                <div className={`p-3 rounded-xl flex items-center gap-4 transition-colors duration-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className={`p-3 rounded-full shadow-md ${isDarkMode ? 'bg-rose-500/20 text-rose-400 shadow-rose-900/10' : 'bg-white text-rose-600 shadow-rose-100'}`}>
                        <Shield size={24} className="stroke-[2.5]" />
                    </div>
                    <div>
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Emergency Support</p>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>24/7 Maintenance</p>
                    </div>

                </div>
            </div>
        </Card>
    );
};

export default ImportantContacts;
