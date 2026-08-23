import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Building, CreditCard, MessageSquare, Settings, Wrench, LogOut, FileText, Bell, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { useTheme } from "../../../context/ThemeContext";

const TenantSidebar = ({ isSidebarOpen, setIsSidebarOpen, userName, handleLogout, user }) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(true);

    const navItems = [
        { id: 'dashboard', path: `/${userName}/tenant/dashboard`, icon: Home, label: 'Dashboard' },
        { id: 'watchlist', path: `/${userName}/tenant/dashboard/watchlist`, icon: Bookmark, label: 'Watchlist' },
        { id: 'notices', path: `/${userName}/tenant/dashboard/notices`, icon: Bell, label: 'Notice Board' },
        { id: 'my-property', path: `/${userName}/tenant/dashboard/my-property`, icon: Building, label: 'My Property' },
        { id: 'services', path: `/${userName}/tenant/dashboard/services`, icon: Wrench, label: 'Home Services' },
        { id: 'payments', path: `/${userName}/tenant/dashboard/payments`, icon: CreditCard, label: 'Payments' },
        { id: 'complaints', path: `/${userName}/tenant/dashboard/complaints`, icon: FileText, label: 'Complaints' },
        { id: 'messages', path: `/${userName}/tenant/dashboard/messages`, icon: MessageSquare, label: 'Messages' },
        { id: 'settings', path: `/${userName}/tenant/dashboard/settings`, icon: Settings, label: 'Settings' },
    ];

    // Shared label style — always rendered but smoothly fades and slides
    const labelStyle = `
        whitespace-nowrap overflow-hidden transition-all duration-400 ease-in-out
        ${isExpanded ? 'max-w-[160px] opacity-100 ml-0' : 'max-w-0 opacity-0 ml-0'}
    `;

    return (
        <aside className={`
            fixed md:static inset-y-0 left-0 z-40 border-r flex flex-col shrink-0
            transition-all duration-500 ease-in-out
            backdrop-blur-2xl
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            ${isExpanded ? 'w-72' : 'w-[72px]'}
            ${isDarkMode ? 'bg-slate-950 border-white/5' : 'bg-white border-slate-200'}
        `}>

            {/* Collapse / Expand Toggle */}
            <button
                onClick={() => setIsExpanded(prev => !prev)}
                className={`
                    hidden md:flex absolute -right-3 top-10 w-6 h-6 rounded-full z-50
                    items-center justify-center text-white shadow-lg
                    transition-all duration-300 hover:scale-110 active:scale-95
                    ${isDarkMode ? 'bg-violet-600 hover:bg-violet-500' : 'bg-violet-500 hover:bg-violet-600'}
                `}
            >
                {/* Icon flips smoothly */}
                <span className={`flex transition-transform duration-500 ${isExpanded ? 'rotate-0' : 'rotate-180'}`}>
                    <ChevronLeft size={14} />
                </span>
            </button>

            {/* ── Logo Section ── */}
            <Link
                to="/"
                title="Go to Home"
                className={`
                flex items-center border-b overflow-hidden cursor-pointer hover:opacity-90
                transition-all duration-500 ease-in-out
                ${isExpanded ? 'px-6 py-5 gap-3' : 'px-1 py-5 justify-center gap-0'}
                ${isDarkMode ? 'border-white/5' : 'border-slate-100'}
            `}>
                {/* Logo image — size transitions smoothly */}
                <div className="relative shrink-0 group">
                    <div className="absolute inset-0 bg-violet-500 blur-[18px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
                    <img
                        src="/favicon.png"
                        alt="RentEase"
                        className={`
                            object-contain relative z-10 drop-shadow-lg
                            transition-all duration-500 ease-in-out
                            ${isExpanded ? 'w-13 h-12' : 'w-11 h-11'}
                        `}
                    />
                </div>

                {/* Text — stays in DOM, fades and collapses horizontally */}
                <div className={`
                    flex flex-col transition-all duration-500 ease-in-out
                    ${isExpanded ? 'max-w-[160px] opacity-100 ml-1' : 'max-w-0 opacity-0'}
                `}>
                    <span className={`text-2xl relative right-5 font-black tracking-tighter whitespace-nowrap ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        RentEase
                    </span>
                    <span className="text-[13px] relative right-5 font-bold uppercase tracking-[0.12em] text-violet-500 whitespace-nowrap">
                        Tenant Dashboard
                    </span>
                </div>
            </Link>

            {/* ── Nav Links ── */}
            <nav className={`
                flex-1 overflow-y-auto overflow-x-hidden mt-2 space-y-1 flex flex-col
                transition-all duration-500 ease-in-out scrollbar-hide
                ${isExpanded ? 'px-4 py-3' : 'px-2 py-3 items-center'}
            `}>
                {navItems.map((item) => {
                    const isActive = item.id === 'dashboard'
                        ? (location.pathname === `/${userName}/tenant/dashboard` || location.pathname === `/${userName}/tenant/dashboard/`)
                        : location.pathname.startsWith(item.path);

                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            title={!isExpanded ? item.label : ''}
                            className={`
                                flex items-center rounded-2xl text-sm font-bold
                                transition-all duration-300 group relative overflow-hidden
                                ${isExpanded ? 'w-full px-4 py-3.5 gap-4' : 'w-11 h-11 justify-center'}
                                ${isActive
                                    ? 'text-white shadow-[0_8px_20px_-6px_rgba(124,58,237,0.45)]'
                                    : isDarkMode
                                        ? 'text-slate-500 hover:text-white hover:bg-white/5'
                                        : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                                }
                            `}
                        >
                            {/* Active gradient bg */}
                            {isActive && <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl" />}

                            {/* Icon */}
                            <item.icon
                                size={20}
                                className={`relative z-10 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : ''}`}
                            />

                            {/* Label — always rendered, smoothly fades */}
                            <span className={`
                                relative z-10 whitespace-nowrap overflow-hidden
                                transition-all duration-500 ease-in-out
                                ${isExpanded ? 'max-w-[160px] opacity-100' : 'max-w-0 opacity-0'}
                            `}>
                                {item.label}
                            </span>

                            {/* Active dot */}
                            {isActive && (
                                <span className={`
                                    absolute right-3 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]
                                    transition-all duration-500
                                    ${isExpanded ? 'opacity-100' : 'opacity-0'}
                                `} />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* ── Bottom: Switch Role + Logout ── */}
            <div className={`
                border-t flex flex-col transition-all duration-500 ease-in-out
                ${isExpanded ? 'px-4 py-4 items-stretch' : 'px-2 py-4 items-center'}
                ${isDarkMode ? 'border-white/5' : 'border-slate-100'}
            `}>
                {/* Switch to Landlord (only if role is landlord) */}
                {user?.role === 'LANDLORD' && (
                    <Link
                        to={`/${user?.name?.toLowerCase().replace(/\s+/g, '-') || 'user'}/landlord/dashboard`}
                        title={!isExpanded ? 'Switch to Landlord Mode' : ''}
                        className={`
                            flex items-center rounded-2xl font-bold mb-2
                            transition-all duration-300 group
                            ${isExpanded ? 'w-full px-4 py-3 gap-4' : 'w-11 h-11 justify-center'}
                            ${isDarkMode ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-emerald-600 hover:bg-emerald-50'}
                        `}
                    >
                        <Building size={20} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
                        <span className={`
                            whitespace-nowrap overflow-hidden transition-all duration-500 ease-in-out
                            ${isExpanded ? 'max-w-[160px] opacity-100' : 'max-w-0 opacity-0'}
                        `}>
                            Switch to Landlord
                        </span>
                    </Link>
                )}

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    title={!isExpanded ? 'Logout' : ''}
                    className={`
                        flex items-center rounded-2xl font-bold
                        transition-all duration-300 group
                        ${isExpanded ? 'w-full px-4 py-3 gap-4' : 'w-11 h-11 justify-center'}
                        ${isDarkMode ? 'text-slate-500 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}
                    `}
                >
                    <LogOut size={20} className="shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
                    <span className={`
                        whitespace-nowrap overflow-hidden transition-all duration-500 ease-in-out
                        ${isExpanded ? 'max-w-[160px] opacity-100' : 'max-w-0 opacity-0'}
                    `}>
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default TenantSidebar;
