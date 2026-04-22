import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Bookmark, MapPin, Bed, Bath, Maximize, Trash2, ArrowRight, Home } from 'lucide-react';
import BASE_URL from '../../../utils/apiConfig';

const WatchlistPage = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.get(`${BASE_URL}/api/watchlist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWatchlist(res.data);
        } catch (err) {
            console.error("Error fetching watchlist:", err);
            toast.error("Failed to load watchlist");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (e, propertyId) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem("accessToken");
            await axios.post(`${BASE_URL}/api/watchlist`, 
                { propertyId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setWatchlist(prev => prev.filter(item => item.id !== propertyId));
            toast.info("Removed from watchlist");
        } catch (err) {
            toast.error("Failed to remove from watchlist");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-6 animate-pulse">
                <div className="h-10 w-64 bg-slate-200 dark:bg-white/5 rounded-xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-80 bg-slate-200 dark:bg-white/5 rounded-3xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <Bookmark className="text-violet-500" size={32} />
                    Your Watchlist
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Properties you're interested in, all in one place.
                </p>
            </div>

            {watchlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-white/5 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10 text-center px-6">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <Bookmark size={40} className="text-slate-300" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No properties here yet</h2>
                    <p className="text-slate-500 dark:text-gray-400 max-w-sm mb-8">
                        Browse properties and click the bookmark icon to save the ones you love for quick access later.
                    </p>
                    <button 
                        onClick={() => navigate('/browse/properties')}
                        className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-violet-500/30 transition-all flex items-center gap-2"
                    >
                        Explore Rentals <ArrowRight size={18} />
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {watchlist.map((property) => (
                        <div 
                            key={property.id}
                            onClick={() => navigate(`/properties/${property.id}`)}
                            className="group relative bg-white dark:bg-[#111] rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <img 
                                    src={property.cover_image} 
                                    alt={property.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                {/* Quick Stats Overlay */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button 
                                        onClick={(e) => handleRemove(e, property.id)}
                                        className="p-3 bg-white/20 hover:bg-rose-500 backdrop-blur-md rounded-2xl text-white transition-all border border-white/20 shadow-xl"
                                        title="Remove from watchlist"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="absolute bottom-4 left-4">
                                    <div className="px-3 py-1 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
                                        {property.property_type || 'Property'}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate group-hover:text-violet-500 transition-colors">
                                        {property.title}
                                    </h3>
                                    <p className="text-violet-600 dark:text-violet-400 font-black text-xl">
                                        ₹{property.price?.toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-6">
                                    <MapPin size={16} className="text-violet-500" />
                                    <span className="truncate">{property.address || property.locality}</span>
                                </div>

                                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 dark:border-white/5">
                                    <div className="flex flex-col items-center gap-1">
                                        <Bed size={18} className="text-slate-400" />
                                        <span className="text-xs font-bold dark:text-white">{property.bedrooms || 0} Beds</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Bath size={18} className="text-slate-400" />
                                        <span className="text-xs font-bold dark:text-white">{property.bathrooms || 0} Baths</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <Maximize size={18} className="text-slate-400" />
                                        <span className="text-xs font-bold dark:text-white">{property.area_sqft || 0} ft²</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WatchlistPage;
