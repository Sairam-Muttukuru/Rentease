import React, { useState } from 'react';
import { Heart, MapPin, Bed, Bath, Maximize, ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Assuming AuthContext exists
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ property }) => {
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const { user } = useAuth(); // simplistic auth check
    const navigate = useNavigate();

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImgIndex((prev) => (prev + 1) % property.images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImgIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    };

    const handleBookNow = (e) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role === 'LANDLORD') return; // Disabled for landlords
        navigate(`/properties/${property.id}`); // Or open booking modal
    };

    const images = property.images && property.images.length > 0
        ? property.images.map(img => img.url)
        : ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1000"]; // Fallback

    return (
        <div
            className="group relative bg-white dark:bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-gray-200 dark:border-white/5 transition-all duration-500 hover:shadow-[0_0_50px_rgba(139,92,246,0.15)] hover:border-violet-500/30 hover:-translate-y-2 flex flex-col h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Slider */}
            <div className="relative h-72 overflow-hidden shrink-0">
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img}
                        alt={property.title}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${index === currentImgIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                            }`}
                    />
                ))}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-80" />

                {/* Navigation */}
                {images.length > 1 && (
                    <div className={`absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <button onClick={prevImage} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110"><ChevronLeft className="w-4 h-4" /></button>
                        <button onClick={nextImage} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                )}

                {/* Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, idx) => (
                        <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImgIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
                    ))}
                </div>

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="flex gap-2 flex-wrap">
                        <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest hover:bg-black/60 transition-colors">
                            {property.property_type}
                        </span>
                        {property.is_featured && (
                            <span className="bg-violet-600/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                                Featured
                            </span>
                        )}
                        {property.status === 'Occupied' && (
                            <span className="bg-red-500/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                                Booked
                            </span>
                        )}
                    </div>
                    <button className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-red-500 hover:text-white transition-all border border-white/10 group-hover:scale-110">
                        <Heart className="w-4 h-4" />
                    </button>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-5 left-6 text-white z-10">
                    <p className="text-3xl font-black tracking-tighter flex items-baseline gap-1 drop-shadow-lg">
                        ${Number(property.price).toLocaleString()}
                        <span className="text-sm font-medium text-gray-300 opacity-80">/mo</span>
                    </p>
                </div>
            </div>

            {/* Details */}
            <div className="p-6 relative flex flex-col flex-1">
                <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-1">{property.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4 text-violet-500 shrink-0" />
                        <p className="text-sm font-medium line-clamp-1">{property.locality}, {property.city}</p>
                    </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-100 dark:border-white/5 mb-4">
                    <div className="text-center p-2 rounded-xl bg-gray-50 dark:bg-white/5 group-hover:bg-gray-100 dark:group-hover:bg-white/10 transition-colors">
                        <Bed className="w-5 h-5 text-gray-400 dark:text-gray-300 mx-auto mb-1" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">{property.bedrooms} Beds</p>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-gray-50 dark:bg-white/5 group-hover:bg-gray-100 dark:group-hover:bg-white/10 transition-colors">
                        <Bath className="w-5 h-5 text-gray-400 dark:text-gray-300 mx-auto mb-1" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">{property.bathrooms} Baths</p>
                    </div>
                    <div className="text-center p-2 rounded-xl bg-gray-50 dark:bg-white/5 group-hover:bg-gray-100 dark:group-hover:bg-white/10 transition-colors">
                        <Maximize className="w-5 h-5 text-gray-400 dark:text-gray-300 mx-auto mb-1" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">{property.area_sqft} sqft</p>
                    </div>
                </div>

                {/* Footer actions */}
                <div className="mt-auto flex gap-3">
                    <button
                        onClick={() => navigate(`/properties/${property.id}`)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-900 dark:text-white py-3 rounded-xl font-bold text-sm transition-all border border-gray-200 dark:border-white/10"
                    >
                        Details
                    </button>
                    <button
                        onClick={handleBookNow}
                        disabled={property.status === 'Occupied' || user?.role === 'LANDLORD'}
                        className="flex-[2] bg-violet-600 hover:bg-violet-500 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2"
                    >
                        {property.status === 'Occupied' ? 'Rented' : 'Book Now'} <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
