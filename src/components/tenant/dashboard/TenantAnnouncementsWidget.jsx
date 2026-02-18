import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Megaphone, Calendar, X } from 'lucide-react';

const TenantAnnouncementsWidget = ({ isDarkMode }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.get("http://localhost:5000/api/announcement/tenant", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnnouncements(res.data);
        } catch (error) {
            console.error("Failed to fetch announcements:", error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'high': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
            case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            default: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
        }
    };

    if (loading) return null; // Or a skeleton loader
    if (announcements.length === 0) return null; // Don't show if empty

    return (
        <>
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-600'}`}>
                        <Megaphone size={20} />
                    </div>
                    <div>
                        <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Announcements</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Recent updates from your landlord</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {announcements.slice(0, 3).map(announcement => (
                        <div
                            key={announcement.id}
                            onClick={() => setSelectedAnnouncement(announcement)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-slate-900 border-slate-700 hover:border-slate-600' : 'bg-slate-50 border-slate-200 hover:border-violet-200'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getPriorityColor(announcement.priority)}`}>
                                    {announcement.priority}
                                </span>
                                <span className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    <Calendar size={12} />
                                    {new Date(announcement.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <h4 className={`font-semibold mb-1 line-clamp-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                {announcement.title}
                            </h4>
                            <p className={`text-sm line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                {announcement.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for viewing announcement details */}
            {selectedAnnouncement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={`relative w-full max-w-lg rounded-2xl p-6 shadow-2xl ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
                        <button
                            onClick={() => setSelectedAnnouncement(null)}
                            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(selectedAnnouncement.priority)}`}>
                                    {selectedAnnouncement.priority?.toUpperCase()}
                                </span>
                                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {new Date(selectedAnnouncement.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">{selectedAnnouncement.title}</h2>
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                                {selectedAnnouncement.category}
                            </p>
                        </div>

                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                            <p className="whitespace-pre-wrap leading-relaxed">
                                {selectedAnnouncement.content}
                            </p>
                        </div>

                        <div className={`mt-6 pt-4 border-t flex justify-end ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                            <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                Posted by {selectedAnnouncement.author_name || 'Landlord'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TenantAnnouncementsWidget;
