import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
    Megaphone,
    MessageSquare,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const LANDLORD_MENU = [
    { id: 'dashboard', icon: TrendingUp, label: 'Dashboard' },
    { id: 'properties', icon: Building, label: 'Properties' },
    { id: 'add-property', icon: PlusCircle, label: 'Add Property' },
    { id: 'tenants', icon: Users, label: 'Tenants' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'requests', icon: Wrench, label: 'Issues at Property' },
    { id: 'finance', icon: IndianRupee, label: 'Financials' },
    { id: 'bookings', icon: Calendar, label: 'Bookings' },
    { id: 'announcements', icon: Megaphone, label: 'Announcements' },
    { id: 'settings', icon: Home, label: 'Settings' }
];

const LandlordSidebar = ({ activeTab, setActiveTab, handleLogout, isDarkMode, isMobileMenuOpen, setIsMobileMenuOpen, user }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <aside className={`fixed inset-y-0 left-0 z-40 backdrop-blur-xl border-r transform transition-all duration-500 ease-in-out flex flex-col shrink-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static ${isExpanded ? 'w-72' : 'w-20'} ${isDarkMode ? 'bg-slate-900/80 border-slate-900' : 'bg-white/90 border-slate-200'}`}>
            
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`hidden md:flex absolute -right-3 top-10 w-6 h-6 rounded-full items-center justify-center z-50 text-white shadow-md transition-transform hover:scale-110 ${isDarkMode ? 'bg-emerald-600' : 'bg-emerald-500'}`}
            >
                {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            <div className={`border-b flex flex-col items-center gap-0 min-h-[100px] justify-center transition-all duration-500 ease-in-out ${isExpanded ? 'p-6' : 'p-2'} ${isDarkMode ? 'border-slate-900' : 'border-slate-100'}`}>
                <div className="flex items-center gap-3 w-full justify-center">
                    <div className="relative shrink-0 group">
                        <div className="absolute inset-0 bg-emerald-500 blur-[18px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
                        <img 
                            src="/favicon.png" 
                            alt="RentEase Logo" 
                            className={`object-contain relative z-10 drop-shadow-lg transition-all duration-500 ease-in-out ${isExpanded ? 'w-16 h-16' : 'w-14 h-14 scale-110 ml-0 hover:scale-125'}`} 
                        />
                    </div>
                    {isExpanded && (
                        <div className="flex flex-col animate-in fade-in duration-300 w-full overflow-hidden">
                            <span className={`text-3xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}>RentEase</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-500">Landlord Portal</span>
                        </div>
                    )}
                </div>
            </div>

            <nav className={`flex-1 ${isExpanded ? 'p-4' : 'p-3'} space-y-2 mt-4 overflow-y-auto scrollbar-hide flex flex-col items-center`}>
                {LANDLORD_MENU.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                            setActiveTab(item.id);
                            setIsMobileMenuOpen(false);
                        }}
                        title={!isExpanded ? item.label : ''}
                        className={`relative z-10 flex items-center rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer ${isExpanded ? 'w-full gap-3 px-4 py-3.5' : 'w-12 h-12 justify-center'} ${activeTab === item.id ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xl shadow-emerald-500/5' : `${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-black hover:bg-slate-100 hover:text-black'}`}`}
                    >
                        <item.icon size={20} className={`shrink-0 ${activeTab === item.id ? 'text-emerald-500' : ''}`} />
                        {isExpanded && <span className="whitespace-nowrap animate-in fade-in duration-300">{item.label}</span>}
                    </button>
                ))}
            </nav>

            <div className={`${isExpanded ? 'p-6' : 'p-3'} border-t flex flex-col items-center flex-shrink-0 ${isDarkMode ? 'border-slate-900' : 'border-slate-100'}`}>
                <Link
                    to={`/${user?.name?.toLowerCase().replace(/\s+/g, '-') || 'user'}/tenant/dashboard`}
                    title={!isExpanded ? "Switch to Tenant Mode" : ""}
                    className={`flex items-center mb-2 rounded-2xl transition-all duration-300 ${isExpanded ? 'w-full gap-3 px-4 py-3' : 'w-12 h-12 justify-center'} ${isDarkMode ? 'text-violet-400 hover:bg-violet-500/10' : 'text-violet-600 hover:bg-violet-50'}`}
                >
                    <Users size={20} className="shrink-0" />
                    {isExpanded && <span className="text-sm font-bold whitespace-nowrap animate-in fade-in duration-300">Switch to Tenant</span>}
                </Link>
                <button 
                    onClick={handleLogout} 
                    title={!isExpanded ? "Logout" : ""}
                    className={`flex items-center rounded-2xl transition-all duration-300 text-slate-500 hover:text-rose-500 ${isExpanded ? 'w-full gap-3 px-4 py-3' : 'w-12 h-12 justify-center'}`}
                >
                    <LogOut size={20} className="shrink-0" />
                    {isExpanded && <span className="text-sm font-bold whitespace-nowrap animate-in fade-in duration-300">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default LandlordSidebar;
