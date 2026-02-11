import React from 'react';
import { Bell, Menu, User, LogOut } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { useTheme } from "../../../context/ThemeContext";

const TenantTopbar = ({
    isSidebarOpen,
    setIsSidebarOpen,
    activeTab, // This might need to be derived from location or passed
    user,
    unreadCount,
    isNotificationsOpen,
    setIsNotificationsOpen,
    dashboardNotifications,
    markNoteAsRead,
    markAllNotesAsRead,
    isUserMenuOpen,
    setIsUserMenuOpen,
    handleLogout
}) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    return (
        <>
            {/* Desktop Header */}
            <header className="hidden md:flex w-full h-20 items-center justify-end px-8 z-20 shrink-0">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className={`p-2 rounded-full relative transition-colors duration-300 ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {isNotificationsOpen && (
                            <div className={`absolute top-12 right-0 w-80 rounded-xl shadow-xl border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                                <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Notifications</h4>
                                    {unreadCount > 0 && (
                                        <span className="text-xs bg-violet-500/10 text-violet-500 px-2 py-0.5 rounded-full font-medium">{unreadCount} New</span>
                                    )}
                                </div>

                                <div className="max-h-[300px] overflow-y-auto">
                                    {dashboardNotifications.length > 0 ? (
                                        dashboardNotifications.map((note, i) => (
                                            <div key={i} onClick={() => !note.isRead && markNoteAsRead(note.id)} className={`p-4 border-b last:border-0 flex gap-3 hover:bg-opacity-50 transition-colors cursor-pointer ${isDarkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-100 hover:bg-slate-50'} ${!note.isRead ? (isDarkMode ? 'bg-violet-500/5' : 'bg-violet-50') : ''}`}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${note.bg} ${note.color}`}>
                                                    <note.icon size={14} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{note.title}</p>
                                                        {!note.isRead && <span className="w-2 h-2 bg-violet-500 rounded-full mt-1"></span>}
                                                    </div>
                                                    <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{note.desc}</p>
                                                    <p className="text-[10px] text-slate-500 mt-1.5">{note.time}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-slate-500 text-sm">
                                            <p>No new notifications</p>
                                        </div>
                                    )}
                                </div>
                                <div className={`p-2 text-center border-t ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50'}`}>
                                    <button
                                        onClick={markAllNotesAsRead}
                                        className="text-xs font-medium text-violet-500 hover:text-violet-600 w-full py-1"
                                    >
                                        Mark all as read
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <ThemeToggle />
                    <div className={`h-8 w-[1px] ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                    <div className="relative">
                        <div
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-3 cursor-pointer"
                        >
                            <div className="text-right hidden sm:block">
                                <p className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name || "User"}</p>
                                <p className="text-[10px] lowercase font-bold text-slate-500">{user.email}</p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-black shadow-lg">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    (user.name || "U").charAt(0)
                                )}
                            </div>
                        </div>

                        {/* User Dropdown Menu */}
                        {isUserMenuOpen && (
                            <div className={`absolute top-14 right-0 mt-2 w-48 rounded-xl shadow-xl border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                                <div className="p-1">
                                    <button
                                        onClick={handleLogout}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-600 hover:bg-rose-50'}`}
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Header */}
            <header className={`h-16 backdrop-blur-md border-b flex items-center justify-between px-4 md:hidden z-10 sticky top-0 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsSidebarOpen(true)} className={`${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                        <Menu size={24} />
                    </button>
                    <h1 className={`text-lg font-semibold capitalize ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {activeTab?.replace?.('-', ' ') || 'Dashboard'}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <div className={`w-8 h-8 rounded-full border overflow-hidden flex items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-violet-500/20 border-violet-500/30 text-violet-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                        {user.avatar_url ? (
                            <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={16} />
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};

export default TenantTopbar;
