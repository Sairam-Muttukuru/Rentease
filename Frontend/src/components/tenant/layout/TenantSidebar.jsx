import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Building, CreditCard, MessageSquare, Settings, Wrench, LogOut, FileText, Bell, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { useTheme } from "../../../context/ThemeContext";

const TenantSidebar = ({ isSidebarOpen, setIsSidebarOpen, userName, handleLogout, user }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const location = useLocation();
    
    // Add state for expandable/collapsible sidebar
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <aside className={`
      fixed md:static inset-y-0 left-0 z-40 backdrop-blur-2xl border-r transform transition-all duration-500 ease-in-out flex flex-col shrink-0
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      ${isExpanded ? 'w-72' : 'w-20'}
      ${isDarkMode ? 'bg-slate-950 border-white/5' : 'bg-white border-slate-200'}
    `}>
            {/* Toggle Button for Desktop */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`hidden md:flex absolute -right-3 top-10 w-6 h-6 rounded-full items-center justify-center z-50 text-white shadow-md transition-transform hover:scale-110 ${isDarkMode ? 'bg-violet-600' : 'bg-violet-500'}`}
            >
                {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            {/* Logo Section */}
            <div className={`p-6 flex flex-col items-center gap-0 min-h-[100px] justify-center ${isDarkMode ? 'border-b border-white/5' : 'border-b border-slate-100'}`}>
                <div className="flex items-center gap-4 w-full justify-center">
                    <div className="relative group shrink-0">
                        <div className={`absolute inset-0 bg-violet-500 blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full`}></div>
                        <img src="/favicon.png" alt="RentEase" className="w-16 h-16 object-contain relative z-10 drop-shadow-lg" />
                    </div>
                    {isExpanded && (
                        <div className="flex flex-col animate-in fade-in duration-300">
                            <span className={`text-2xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>RentEase</span>
                            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-violet-500">Tenant Dashboard</span>
                        </div>
                    )}
                </div>
            </div>

            <nav className={`flex-1 overflow-y-auto mt-2 space-y-2 ${isExpanded ? 'p-6' : 'p-3'} scrollbar-hide flex flex-col items-center`}>
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
                            onClick={() => setIsSidebarOpen(false)} // Close on navigate on mobile
                            title={!isExpanded ? item.label : ''} // Show tooltip if collapsed
                            className={`
                  flex items-center rounded-2xl text-sm font-bold transition-all duration-300 group relative overflow-hidden
                  ${isExpanded ? 'w-full gap-4 px-4 py-3.5' : 'w-12 h-12 justify-center'}
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
                            <item.icon size={20} className={`relative z-10 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-current'}`} />

                            {/* Label */}
                            {isExpanded && (
                                <span className="relative z-10 whitespace-nowrap animate-in fade-in duration-300">{item.label}</span>
                            )}

                            {/* Active Indicator Dot */}
                            {isActive && isExpanded && (
                                <span className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]"></span>
                            )}
                        </Link>
                    );
                })}

            </nav>

            {/* Switch & Logout Section */}
            <div className={`${isExpanded ? 'p-6' : 'p-3'} border-t flex flex-col items-center ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                {user?.role === 'LANDLORD' && (
                    <Link
                        to={`/${user?.name?.toLowerCase().replace(/\s+/g, '-') || 'user'}/landlord/dashboard`}
                        title={!isExpanded ? "Switch to Landlord Mode" : ""}
                        className={`flex items-center mb-2 rounded-2xl transition-all duration-300 group font-bold
                            ${isExpanded ? 'w-full gap-4 px-4 py-3.5' : 'w-12 h-12 justify-center'}
                            ${isDarkMode
                                ? 'text-emerald-400 hover:bg-emerald-500/10'
                                : 'text-emerald-600 hover:bg-emerald-50'}
                        `}
                    >
                        <Building size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
                        {isExpanded && <span className="whitespace-nowrap animate-in fade-in duration-300">Switch to Landlord</span>}
                    </Link>
                )}
                <button
                    onClick={handleLogout}
                    title={!isExpanded ? "Logout" : ""}
                    className={`flex items-center rounded-2xl transition-all duration-300 group font-bold
              ${isExpanded ? 'w-full gap-4 px-4 py-3.5' : 'w-12 h-12 justify-center'}
              ${isDarkMode
                            ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10'
                            : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}
            `}
                >
                    <LogOut size={20} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
                    {isExpanded && <span className="whitespace-nowrap animate-in fade-in duration-300">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default TenantSidebar;
