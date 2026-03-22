import React from 'react';
import { X, Mail, Phone, Award, ShieldCheck, MapPin } from 'lucide-react';

const LandlordProfileModal = ({ isDarkMode, onClose, landlord }) => {
    if (!landlord) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-28 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
            <div 
                className={`relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 scale-in-center ${
                    isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-100'
                }`}
            >
                {/* Close Button - Moved and z-index increased */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-[60]"
                >
                    <X size={20} />
                </button>

                {/* Header/Banner Area */}
                <div className="h-32 bg-gradient-to-r from-violet-600 to-indigo-600 relative">
                    {/* Decorative Circles */}
                    <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
                    <div className="absolute top-12 -right-10 w-32 h-32 rounded-full bg-indigo-400/20 blur-2xl"></div>
                </div>

                {/* Profile Avatar Container */}
                <div className="relative px-6 pb-6 mt-[-48px]">
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 p-1 shadow-xl">
                                {landlord.avatar_url ? (
                                    <img 
                                        src={landlord.avatar_url} 
                                        alt={landlord.name} 
                                        className="w-full h-full object-cover rounded-[22px]"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold bg-slate-800 rounded-[22px]">
                                        {landlord.name?.charAt(0) || '?'}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full p-1.5 shadow-lg">
                                <ShieldCheck size={14} className="text-white" />
                            </div>
                        </div>

                        <h3 className={`mt-4 text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {landlord.name || 'Property Manager'}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                            <Award size={14} className="text-amber-500" />
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">Verified Landlord</span>
                        </div>
                    </div>

                    {/* Stats/Badges */}
                    <div className="grid grid-cols-2 gap-3 mt-8">
                        <div className={`p-4 rounded-2xl flex flex-col items-center justify-center border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                            <p className="text-sm font-bold text-violet-500">Active</p>
                            <p className={`text-[10px] uppercase font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Status</p>
                        </div>
                        <div className={`p-4 rounded-2xl flex flex-col items-center justify-center border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                            <p className={`text-sm font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Premium</p>
                            <p className={`text-[10px] uppercase font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Host Tier</p>
                        </div>
                    </div>

                    {/* Contact Info Section */}
                    <div className="mt-8 space-y-4">
                        <h4 className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Contact Information</h4>
                        
                        <div className="flex items-center gap-4 group">
                            <div className={`p-3 rounded-xl transition-colors ${isDarkMode ? 'bg-slate-800 group-hover:bg-violet-500/20' : 'bg-violet-50 group-hover:bg-violet-100'}`}>
                                <Mail size={18} className="text-violet-500" />
                            </div>
                            <div className="flex-1">
                                <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Email Address</p>
                                <p className={`text-sm font-semibold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                    {landlord.email || 'Not shared'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className={`p-3 rounded-xl transition-colors ${isDarkMode ? 'bg-slate-800 group-hover:bg-violet-500/20' : 'bg-violet-50 group-hover:bg-violet-100'}`}>
                                <Phone size={18} className="text-violet-500" />
                            </div>
                            <div className="flex-1">
                                <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Phone Number</p>
                                <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                    {landlord.phone || 'Contact via message'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className={`p-3 rounded-xl transition-colors ${isDarkMode ? 'bg-slate-800 group-hover:bg-violet-500/20' : 'bg-violet-50 group-hover:bg-violet-100'}`}>
                                <MapPin size={18} className="text-violet-500" />
                            </div>
                            <div className="flex-1">
                                <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Location</p>
                                <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                    Vijayawada, India
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Call to Action */}
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                        <p className={`text-[10px] text-center italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            * Professional landlord verified by RentEase Audit Team
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandlordProfileModal;
