import React from 'react';
import TenantSidebar from './TenantSidebar';
import TenantTopbar from './TenantTopbar';
import { useTheme } from "../../../context/ThemeContext";
import { Check } from 'lucide-react';

const TenantLayout = ({
    children,
    isSidebarOpen,
    setIsSidebarOpen,
    userName,
    handleLogout,
    activeTab,
    user,
    unreadCount,
    isNotificationsOpen,
    setIsNotificationsOpen,
    dashboardNotifications,
    markNoteAsRead,
    markAllNotesAsRead,
    isUserMenuOpen,
    setIsUserMenuOpen,
    notification // passed from dashboard state for toast
}) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    return (
        <div className={`min-h-screen h-screen overflow-hidden flex font-sans selection:bg-violet-500/30 transition-colors duration-500 ease-in-out ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

            {/* Toast Notification */}
            {notification && (
                <div className="fixed top-6 right-6 z-[60] animate-in slide-in-from-right-10 fade-in duration-300">
                    <div className={`border px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                        <div className="bg-emerald-500/20 rounded-full p-1 border border-emerald-500/30">
                            <Check size={14} className="text-emerald-400" />
                        </div>
                        <p className="font-medium text-sm">{notification.message}</p>
                    </div>
                </div>
            )}

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <TenantSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                userName={userName}
                handleLogout={handleLogout}
                user={user}
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <TenantTopbar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    activeTab={activeTab}
                    user={user}
                    unreadCount={unreadCount}
                    isNotificationsOpen={isNotificationsOpen}
                    setIsNotificationsOpen={setIsNotificationsOpen}
                    dashboardNotifications={dashboardNotifications}
                    markNoteAsRead={markNoteAsRead}
                    markAllNotesAsRead={markAllNotesAsRead}
                    isUserMenuOpen={isUserMenuOpen}
                    setIsUserMenuOpen={setIsUserMenuOpen}
                    handleLogout={handleLogout}
                />

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <div className="max-w-7xl mx-auto">
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TenantLayout;
