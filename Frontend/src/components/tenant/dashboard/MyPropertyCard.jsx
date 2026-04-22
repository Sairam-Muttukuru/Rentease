/* eslint-disable no-unused-vars */
import React from 'react';
import { MessageSquare, MapPin, Building } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useTheme } from "../../../context/ThemeContext";

const MyPropertyCard = ({ user, propertyImages, currentImageIndex, navigate, isDarkMode }) => {
    return (
        <Card className="p-0 overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300">
            {/* Image Section */}
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden group bg-slate-100 dark:bg-slate-900 shadow-inner">
                {/* Blurred Backdrop */}
                <img
                    src={propertyImages[currentImageIndex] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop"}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-40 scale-125"
                />
                {/* Main Fitted Image */}
                <img
                    key={currentImageIndex}
                    src={propertyImages[currentImageIndex] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop"}
                    alt="Property"
                    className="relative w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-slate-900/80 to-transparent' : 'from-slate-900/40 to-transparent'} z-10`}></div>
                
                <div className="absolute top-4 right-4">
                    <span className="bg-emerald-500 text-white text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider shadow-lg">Occupied</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold truncate tracking-tight">{user.propertyName}</h3>
                    <div className="flex items-center gap-1.5 opacity-90 mt-0.5">
                        <MapPin size={12} className="text-violet-400" />
                        <p className="text-xs truncate">{user.address}</p>
                    </div>
                </div>
            </div>

            {/* Simplified Content Body */}
            <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    {/* Landlord Info */}
                    <div className={`p-3 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex justify-between items-start mb-1">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Landlord</p>
                            <button onClick={() => navigate('messages')} className="text-violet-500 hover:text-violet-600 transition-colors">
                                <MessageSquare size={14} />
                            </button>
                        </div>
                        <p className={`font-semibold text-sm truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{user.landlord}</p>
                    </div>

                    {/* Rent Info */}
                    <div className={`p-3 rounded-2xl border transition-colors ${isDarkMode ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Monthly Rent</p>
                        <p className={`font-bold text-sm ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                            ₹{Math.round(user.monthlyRent || 0).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Assigned Unit */}
                {(user.room_number || user.flat_number) && (
                    <div className={`p-3 rounded-2xl border flex items-center gap-3 ${isDarkMode ? 'bg-slate-800/20 border-slate-700' : 'border-slate-100 bg-slate-50/50'}`}>
                        <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-400 shadow-sm'}`}>
                            <Building size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Unit Assigned</p>
                            <p className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                {user.room_number ? `Room ${user.room_number}` : `Flat ${user.flat_number}`}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Simple Action */}
            <div className="p-5 pt-0">
                <Button 
                    className="w-full justify-center py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-600/10 transition-all duration-300"
                    onClick={() => navigate('my-property')}
                >
                    View Property Details
                </Button>
            </div>
        </Card>
    );
};

export default MyPropertyCard;



