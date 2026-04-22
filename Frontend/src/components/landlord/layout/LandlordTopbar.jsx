import React from 'react';
import { Bell, Menu } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';
import NotificationDropdown from './NotificationDropdown';

const LandlordTopbar = ({
    user,
    isDarkMode,
    unreadCount,
    notifications,
    markAsRead,
    markAllAsRead,
    isNotificationOpen,
    setIsNotificationOpen,
    setIsMobileMenuOpen
}) => {
    return (
        <header className={`w-full h-20 flex items-center justify-between px-4 md:px-8 z-20 shrink-0 sticky top-0 transition-colors duration-500 backdrop-blur-md border-b ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
            {/* Left: Mobile Menu & Branding */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className={`md:hidden p-2 rounded-xl border ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}
                >
                    <Menu size={20} />
                </button>
                <div className="hidden md:block">
                    <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-500 tracking-tight">Landlord Dashboard</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Welcome back, <span className="text-emerald-600 dark:text-emerald-400 font-bold">{user.name?.split(' ')[0] || "Landlord"}</span></p>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4 md:gap-6">
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className={`p-2.5 rounded-xl border transition-all relative ${isDarkMode ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900"></span>
                        )}
                    </button>
                    {isNotificationOpen && (
                        <NotificationDropdown
                            notifications={notifications}
                            markAsRead={markAsRead}
                            markAllAsRead={markAllAsRead}
                            isDarkMode={isDarkMode}
                        />
                    )}
                </div>

                <ThemeToggle />

                <div className={`hidden md:block h-8 w-[1px] ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</p>
                        <p className="text-[10px] lowercase font-bold text-slate-500">{user.email}</p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-black shadow-lg overflow-hidden border border-emerald-500/20">
                        {user.avatar_url ? (
                            <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span>{user.name?.charAt(0)}</span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default LandlordTopbar;
