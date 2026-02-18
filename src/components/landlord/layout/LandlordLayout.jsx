import React from 'react';
import LandlordSidebar from './LandlordSidebar';
import LandlordTopbar from './LandlordTopbar';
import { useTheme } from "../../../context/ThemeContext";
import { Check } from 'lucide-react';
import { Card } from '../../ui/card';

const LandlordLayout = ({
    children,
    activeTab,
    setActiveTab,
    user,
    unreadCount,
    notifications,
    markAsRead,
    markAllAsRead,
    handleLogout,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isNotificationOpen,
    setIsNotificationOpen,
    notificationToast
}) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    return (
        <div className={`h-screen overflow-hidden flex font-sans selection:bg-violet-500/30 transition-colors duration-500 ease-in-out ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

            {/* Toast Notification */}
            {notificationToast && (
                <div className="fixed top-6 right-6 z-[60] animate-in slide-in-from-right-10 fade-in duration-300">
                    <Card isDarkMode={isDarkMode} className={`px-4 py-3 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-3 shadow-xl`}>
                        <Check size={18} />
                        <p className="font-bold text-sm">{notificationToast.message}</p>
                    </Card>
                </div>
            )}

            {/* Sidebar Overlay (Mobile) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <LandlordSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
                isDarkMode={isDarkMode}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                user={user}
            />

            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Decorative Background Glows */}
                <div className={`absolute top-0 left-0 w-full h-full pointer-events-none z-0 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px]"></div>
                </div>

                {/* Topbar */}
                <LandlordTopbar
                    user={user}
                    isDarkMode={isDarkMode}
                    unreadCount={unreadCount}
                    notifications={notifications}
                    markAsRead={markAsRead}
                    markAllAsRead={markAllAsRead}
                    isNotificationOpen={isNotificationOpen}
                    setIsNotificationOpen={setIsNotificationOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10 scrollbar-hide">
                    <div className="max-w-7xl mx-auto">
                        <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandlordLayout;
