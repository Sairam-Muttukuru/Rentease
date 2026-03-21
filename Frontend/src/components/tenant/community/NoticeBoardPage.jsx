import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from "../../../context/ThemeContext";
import Card from '../ui/Card';
import { Bell, Calendar, Pin, AlertTriangle, PartyPopper, Wrench, Clock, Search } from 'lucide-react';

const NoticeBoardPage = () => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const res = await axios.get('https://rentease-1-pwm5.onrender.com/api/announcement/tenant', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Map backend fields to frontend expected fields if necessary
                const formatted = res.data.map(n => ({
                    ...n,
                    date: new Date(n.created_at).toLocaleDateString(),
                    author: n.author_name || "Landlord" // Assuming backend returns author_name
                }));
                setNotices(formatted);
            } catch (error) {
                console.error("Failed to fetch notices", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    const getIcon = (category) => {
        switch (category) {
            case 'Maintenance': return <Wrench size={18} />;
            case 'Event': return <PartyPopper size={18} />;
            default: return <Bell size={18} />;
        }
    };

    const getColor = (category) => {
        switch (category) {
            case 'Maintenance': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'Event': return 'text-violet-500 bg-violet-500/10 border-violet-500/20';
            default: return 'text-sky-500 bg-sky-500/10 border-sky-500/20';
        }
    };

    const filteredNotices = notices.filter(notice => {
        const matchesFilter = filter === 'all' || notice.category.toLowerCase() === filter;
        const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || notice.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Notice Board
                    </h1>
                    <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Stay updated with community announcements and events.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search notices..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`pl-10 pr-4 py-2 rounded-xl text-sm w-full sm:w-64 border focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                        />
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {['all', 'maintenance', 'event', 'general'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize border
                            ${filter === cat
                                ? 'bg-violet-600 border-violet-600 text-white'
                                : `${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'}`
                            }
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Notices Grid */}
            <div className="grid gap-4">
                {filteredNotices.length > 0 ? (
                    filteredNotices.map((notice) => (
                        <div
                            key={notice.id}
                            className={`relative p-6 rounded-2xl border transition-all duration-300 group hover:shadow-lg hover:-translate-y-1
                                ${isDarkMode ? 'bg-slate-900/50 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-violet-200'}
                            `}
                        >
                            {/* Priority Indicator */}
                            {notice.priority === 'high' && (
                                <div className="absolute top-0 right-0 p-3">
                                    <Pin size={16} className={`rotate-45 ${isDarkMode ? 'text-rose-400' : 'text-rose-500'}`} fill="currentColor" />
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${getColor(notice.category)}`}>
                                    {getIcon(notice.category)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${getColor(notice.category)}`}>
                                            {notice.category}
                                        </span>
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <Calendar size={12} /> {notice.date}
                                        </span>
                                    </div>
                                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{notice.title}</h3>
                                    <p className={`leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {notice.content}
                                    </p>
                                </div>
                            </div>

                            <div className={`mt-4 pt-4 border-t flex items-center justify-between text-xs sm:text-sm font-medium ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-500'}`}>
                                <span className="flex items-center gap-2">Posted by: <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{notice.author}</span></span>
                                <span className="flex items-center gap-1"><Clock size={14} /> 2 mins read</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 opacity-50">
                        <Bell size={48} className="mx-auto mb-4 text-slate-400" />
                        <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>No notices found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoticeBoardPage;
