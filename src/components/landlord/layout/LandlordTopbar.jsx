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
        <header className="w-full h-20 flex items-center justify-between md:justify-end px-4 md:px-8 z-20 shrink-0">
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`md:hidden p-2 rounded-xl border ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}
            >
                <Menu size={20} />
            </button>

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
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-black shadow-lg">
                        {user.name?.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default LandlordTopbar;
