import React from 'react';
import { Wrench, CheckCircle2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useTheme } from "../../../context/ThemeContext";

const HomeServicesTeaser = ({ navigate }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    return (
        <Card className="p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500`}>
                <Wrench size={100} className={isDarkMode ? 'text-orange-400' : 'text-orange-600'} />
            </div>

            <h3 className={`text-xl font-bold mb-4 relative z-10 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Home Services</h3>

            <div className="space-y-4 relative z-10">
                <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors duration-500 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div>
                        <p className={`text-xs uppercase tracking-wider mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>Last Service Used</p>
                        <p className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>General Cleaning</p>
                    </div>
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                        <CheckCircle2 size={20} />
                    </div>
                </div>

                <div className="flex justify-between items-center px-2">
                    <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>Active Requests</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-sm ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-900'}`}>0</span>
                </div>

                <Button
                    onClick={() => navigate('services')}
                    className={`w-full justify-center mt-2 ${isDarkMode ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-orange-500/20' : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/20'} border-none text-white shadow-lg`}
                >
                    Book a Service
                </Button>
            </div>
        </Card>
    );
};

export default HomeServicesTeaser;
