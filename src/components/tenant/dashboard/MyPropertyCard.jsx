import React from 'react';
import { MessageSquare } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useTheme } from "../../../context/ThemeContext";

const MyPropertyCard = ({ user, propertyImages, currentImageIndex, navigate, isDarkMode }) => {
    return (
        <Card className="p-0 overflow-hidden flex flex-col h-full hover:shadow-[0_0_30px_rgba(0,0,0,0.1)] transition-shadow duration-500">
            <div className="relative h-48 sm:h-56 w-full shrink-0 overflow-hidden group">
                <img
                    key={currentImageIndex} // Key added to trigger animation on index change
                    src={propertyImages[currentImageIndex] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop"}
                    alt="Property"
                    className="w-full h-full object-cover animate-in fade-in group-hover:scale-105 transition-transform duration-1000"
                />
                <div className={`absolute inset-0 bg-gradient-to-t transition-colors duration-500 ${isDarkMode ? 'from-slate-900/90 to-transparent' : 'from-white/90 to-transparent'}`}></div>
                <div className="absolute bottom-4 left-4">
                    <h3 className={`text-xl font-bold transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.propertyName}</h3>
                    <p className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{user.address}</p>
                </div>
                <div className="absolute top-4 right-4">
                    <span className="bg-emerald-500/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/20 font-medium">Occupied</span>
                </div>
            </div>

            <div className="p-6 flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className={`p-3 rounded-lg border transition-colors duration-500 flex justify-between items-center ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                        <div>
                            <p className={`text-xs uppercase tracking-wider transition-colors duration-500 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Landlord</p>
                            <p className={`font-medium transition-colors duration-500 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{user.landlord}</p>
                        </div>
                        <button onClick={() => navigate('my-property')} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'}`}>
                            <MessageSquare size={16} />
                        </button>
                    </div>

                    <div className={`p-3 rounded-lg border transition-colors duration-500 ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                        <p className={`text-xs uppercase tracking-wider transition-colors duration-500 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Monthly Rent</p>
                        <p className={`font-bold transition-colors duration-500 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}>₹{user.monthlyRent?.toLocaleString() || '0'}</p>
                    </div>
                </div>
            </div>

            <div className="p-6 pt-0 mt-auto">
                <Button variant="outline" className="w-full justify-center" onClick={() => navigate('my-property')}>
                    View Property Details
                </Button>
            </div>
        </Card>
    );
};

export default MyPropertyCard;
