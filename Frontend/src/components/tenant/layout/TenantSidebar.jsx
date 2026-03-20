import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Building, CreditCard, MessageSquare, Settings, Wrench, LogOut, FileText, Bell } from 'lucide-react';
import { useTheme } from "../../../context/ThemeContext";

const TenantSidebar = ({ isSidebarOpen, setIsSidebarOpen, userName, handleLogout, user }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const location = useLocation();

    return (
        <aside className={`
      fixed md:static inset-y-0 left-0 z-30 w-72 backdrop-blur-2xl border-r transform transition-transform duration-500 ease-in-out flex flex-col shrink-0
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      ${isDarkMode ? 'bg-slate-950 border-white/5' : 'bg-white border-slate-200'}
    `}>
            {/* Logo Section */}
            <div className={`p-8 flex flex-col items-start gap-0 ${isDarkMode ? 'border-b border-white/5' : 'border-b border-slate-100'}`}>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className={`absolute inset-0 bg-violet-500 blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full`}></div>
                        <img src="/favicon.png" alt="RentEase" className="min-w-12 min-h-12 object-contain relative top-0.5 z-10 drop-shadow-lg" />
                    </div>
                    <span className={`text-3xl relative right-7 font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>RentEase</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-500 relative left-16 bottom-1">Tenant Dashboard</span>
            </div>

            <nav className="flex-1 p-6 space-y-2 mt-2 overflow-y-auto">
                {[
                    { id: 'dashboard', path: `/${userName}/tenant/dashboard`, icon: Home, label: 'Dashboard' },
                    { id: 'notices', path: `/${userName}/tenant/dashboard/notices`, icon: Bell, label: 'Notice Board' },
                    { id: 'my-property', path: `/${userName}/tenant/dashboard/my-property`, icon: Building, label: 'My Property' },
                    { id: 'services', path: `/${userName}/tenant/dashboard/services`, icon: Wrench, label: 'Home Services' },
                    { id: 'payments', path: `/${userName}/tenant/dashboard/payments`, icon: CreditCard, label: 'Payments' },
                    { id: 'complaints', path: `/${userName}/tenant/dashboard/complaints`, icon: FileText, label: 'Complaints' },
                    { id: 'messages', path: `/${userName}/tenant/dashboard/messages`, icon: MessageSquare, label: 'Messages' },
                    { id: 'settings', path: `/${userName}/tenant/dashboard/settings`, icon: Settings, label: 'Settings' },
                ].map((item) => {
                    const isActive = item.id === 'dashboard'
                        ? (location.pathname === `/${userName}/tenant/dashboard` || location.pathname === `/${userName}/tenant/dashboard/`)
                        : location.pathname.includes(item.path);

                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)} // Close on navigate
                            className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group relative overflow-hidden
                  ${isActive
                                    ? 'text-white shadow-[0_8px_20px_-6px_rgba(124,58,237,0.5)] scale-[1.02]'
                                    : `${isDarkMode ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
                `}
                        >
                            {/* Active Background Gradient */}
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600"></div>
                            )}

                            {/* Icon */}
                            <item.icon size={20} className={`relative z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-current'}`} />

                            {/* Label */}
                            <span className="relative z-10">{item.label}</span>

                            {/* Active Indicator Dot */}
                            {isActive && (
                                <span className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]"></span>
                            )}
                        </Link>
                    );
                })}

            </nav>

            {/* Logout Section */}
            <div className={`p-6 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group font-bold
              ${isDarkMode
                            ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10'
                            : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}
            `}
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default TenantSidebar;
