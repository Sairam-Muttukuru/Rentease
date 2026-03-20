import React from 'react';
import { BellRing, CreditCard, MessageSquare } from 'lucide-react';

const NotificationDropdown = ({ notifications, markAsRead, markAllAsRead, isDarkMode }) => (
    <div className={`absolute top-12 right-0 w-96 rounded-2xl shadow-2xl border overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
            <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Notifications</h3>
            {notifications.some(n => !n.is_read) && (
                <button onClick={markAllAsRead} className="text-xs font-bold text-violet-500 hover:text-violet-600">Mark all read</button>
            )}
        </div>
        <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
            {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                    <BellRing size={32} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No new notifications</p>
                </div>
            ) : (
                notifications.map(n => (
                    <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-4 border-b transition-colors cursor-pointer ${n.is_read ? (isDarkMode ? 'bg-slate-900/50 opacity-60' : 'bg-white opacity-60') : (isDarkMode ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-slate-50 hover:bg-slate-100')} ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                        <div className="flex gap-3">
                            <div className={`mt-1 p-2 rounded-full h-fit ${n.type === 'payment' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-violet-500/10 text-violet-500'}`}>
                                {n.type === 'payment' ? <CreditCard size={14} /> : <MessageSquare size={14} />}
                            </div>
                            <div>
                                <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{n.title}</h4>
                                <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                                <p className="text-[10px] text-slate-400 mt-2">{new Date(n.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);

export default NotificationDropdown;
