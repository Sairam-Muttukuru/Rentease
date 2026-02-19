import React from 'react';
import {
    Building,
    Users,
    Wrench,
    IndianRupee,
    Calendar,
    LogOut,
    TrendingUp,
    PlusCircle,
    Home,
    Megaphone
} from 'lucide-react';

const LANDLORD_MENU = [
    { id: 'dashboard', icon: TrendingUp, label: 'Dashboard' },
    { id: 'properties', icon: Building, label: 'Properties' },
    { id: 'add-property', icon: PlusCircle, label: 'Add Property' },
    { id: 'tenants', icon: Users, label: 'Tenants' },
    { id: 'requests', icon: Wrench, label: 'Issues at Property' },
    { id: 'finance', icon: IndianRupee, label: 'Financials' },
    { id: 'bookings', icon: Calendar, label: 'Bookings' },
    { id: 'announcements', icon: Megaphone, label: 'Announcements' }, // Added Announcements
    { id: 'settings', icon: Home, label: 'Settings' } // Added settings as it was in the switch but not menu
];

const LandlordSidebar = ({ activeTab, setActiveTab, handleLogout, isDarkMode, isMobileMenuOpen, setIsMobileMenuOpen, user }) => {
    return (
        <aside className={`fixed inset-y-0 left-0 z-30 w-72 backdrop-blur-xl border-r transform transition-transform duration-500 ease-in-out flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static ${isDarkMode ? 'bg-slate-900/80 border-slate-900' : 'bg-white/90 border-slate-200'}`}>
            <div className={`p-8 border-b flex flex-col items-start gap-0 ${isDarkMode ? 'border-slate-900' : 'border-slate-100'}`}>
                <div className="flex items-center gap-3">
                    <img src="/favicon.png" alt="RentEase Logo" className="w-17 h-12 object-contain" />
                    <span className={`text-3xl relative right-5 bottom-0.5 font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}>RentEase</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500 relative left-14 bottom-2">Landlord Portal</span>
            </div>
            <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto scrollbar-hide">
                {LANDLORD_MENU.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                            setActiveTab(item.id);
                            setIsMobileMenuOpen(false);
                        }}
                        className={`relative z-50 w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer ${activeTab === item.id ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xl shadow-emerald-500/5' : `${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-black hover:bg-slate-100 hover:text-black'}`}`}
                    >
                        <item.icon size={20} className={activeTab === item.id ? 'text-emerald-500' : ''} />
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className={`p-6 border-t ${isDarkMode ? 'border-slate-900' : 'border-slate-100'}`}>
                <a
                    href={`/${user?.name?.toLowerCase().replace(/\s+/g, '-') || 'user'}/tenant/dashboard`}
                    className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-2xl transition-all duration-300 ${isDarkMode ? 'text-violet-400 hover:bg-violet-500/10' : 'text-violet-600 hover:bg-violet-50'}`}
                >
                    <Users size={20} />
                    <span className="text-sm font-bold">Switch to Tenant Mode</span>
                </a>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-slate-500 hover:text-rose-500">
                    <LogOut size={20} />
                    <span className="text-sm font-bold">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default LandlordSidebar;
