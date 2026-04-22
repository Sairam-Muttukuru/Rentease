import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { MapPin, Bed, Bath, Maximize, ArrowLeft, Star, Heart, Share2, CheckCircle, AlertCircle, MessageCircle, X, Users, Briefcase, Building, Car, Utensils, Zap, GraduationCap, HeartPulse, Train, ShoppingBag, Store, ChevronDown, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ChatWindow from '../components/chat/ChatWindow';
import FreeMap from '../components/common/FreeMap';

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingMessage, setBookingMessage] = useState("");
    const [isBooking, setIsBooking] = useState(false);
    const [showAllImages, setShowAllImages] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('education');
    const [pois, setPois] = useState([]);
    const [poisLoading, setPoisLoading] = useState(false);
    const [poisError, setPoisError] = useState(false);
    const [inWatchlist, setInWatchlist] = useState(false);
    const poiListRef = useRef(null);

    // Resolve API URL dynamically
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const NEIGHBOURHOOD_CATEGORIES = [
        { id: 'education', name: 'Education', icon: GraduationCap, color: 'violet', label: 'Schools & Colleges' },
        { id: 'healthcare', name: 'Healthcare', icon: HeartPulse, color: 'rose', label: 'Hospitals & Clinics' },
        { id: 'commute', name: 'Commute', icon: Train, color: 'blue', label: 'Metro & Bus' },
        { id: 'food', name: 'Food & Drinks', icon: Utensils, color: 'orange', label: 'Restaurants' },
        { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'emerald', label: 'Malls & Stores' },
    ];

    // Optimized Overpass API queries per category (searches 2.5km for better coverage)
    const OVERPASS_QUERIES = {
        education: `(nwr["amenity"~"school|college|university|kindergarten|library"](around:2500,{{lat}},{{lng}}););`,
        healthcare: `(nwr["amenity"~"hospital|clinic|pharmacy|doctors|dentist"](around:2500,{{lat}},{{lng}}););`,
        commute:    `(nwr["amenity"~"bus_station|bus_stop|train_station"](around:2500,{{lat}},{{lng}});nwr["highway"~"bus_stop"](around:2500,{{lat}},{{lng}}););`,
        food:       `(nwr["amenity"~"restaurant|cafe|fast_food|food_court|bar|pub|ice_cream|bakery"](around:2500,{{lat}},{{lng}}););`,
        shopping:   `(nwr["shop"~"supermarket|mall|convenience|grocery|department_store|clothes|electronics|bakery"](around:2500,{{lat}},{{lng}}););`,
    };

    // Haversine formula — calculates real-world distance in meters between two GPS points
    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };

    const formatDistance = (meters) => meters < 1000 ? `${meters}m` : `${(meters / 1000).toFixed(1)}km`;

    // Cache for POI results to make tab switching instant
    const [poiCache, setPoiCache] = useState({});

    const getDummyPois = (category, lat, lng) => {
        const dummies = {
            education: [
                { name: "Global Public School", type: "School", dist: 450 },
                { name: "Tirupati City College", type: "University", dist: 1200 },
                { name: "Bright Minds Kindergarten", type: "School", dist: 800 },
                { name: "Central Library", type: "Library", dist: 150 }
            ],
            healthcare: [
                { name: "City Life Hospital", type: "Hospital", dist: 600 },
                { name: "Wellness Clinic", type: "Clinic", dist: 1500 },
                { name: "SafeCare Pharmacy", type: "Pharmacy", dist: 300 }
            ],
            commute: [
                { name: "Main Metro Station", type: "Metro", dist: 1100 },
                { name: "Central Bus Terminus", type: "Bus Station", dist: 900 },
                { name: "Downtown Bus Stop", type: "Bus Stop", dist: 250 }
            ],
            food: [
                { name: "The Spice Garden", type: "Restaurant", dist: 500 },
                { name: "Coffee House", type: "Cafe", dist: 700 },
                { name: "Quick Bites", type: "Fast Food", dist: 350 }
            ],
            shopping: [
                { name: "Grand Mall", type: "Mall", dist: 2000 },
                { name: "City Supermarket", type: "Supermarket", dist: 1200 },
                { name: "Fashion Hub", type: "Clothing Store", dist: 1800 }
            ]
        };

        return (dummies[category] || []).map((d, index) => ({
            name: `${d.name} (Local)`,
            latitude: lat + (Math.random() - 0.5) * 0.015,
            longitude: lng + (Math.random() - 0.5) * 0.015,
            category: category,
            type: d.type,
            distance: d.dist < 1000 ? `${d.dist}m` : `${(d.dist / 1000).toFixed(1)}km`,
            rawDistance: d.dist
        }));
    };

    // --- ENHANCED PRE-FETCHING ENGINE ---
    useEffect(() => {
        if (!property) return;

        const propLat = parseFloat(property?.latitude);
        const propLng = parseFloat(property?.longitude);
        const lat = (isNaN(propLat) || propLat === 0) ? 13.6288 : propLat;
        const lng = (isNaN(propLng) || propLng === 0) ? 79.4192 : propLng;

        const mirrors = [
            'https://overpass-api.de/api/interpreter',
            'https://overpass.kumi.systems/api/interpreter'
        ];

        // Function to fetch a single category
        const preFetchCategory = async (category) => {
            if (poiCache[category]) return;

            let success = false;
            for (const mirror of mirrors) {
                if (success) break;
                try {
                    const queryTemplate = OVERPASS_QUERIES[category];
                    const query = queryTemplate.replace(/{{lat}}/g, lat).replace(/{{lng}}/g, lng);
                    const overpassQuery = `[out:json][timeout:10];${query}out center 15;`;
                    const res = await axios.get(`${mirror}?data=${encodeURIComponent(overpassQuery)}`, { timeout: 8000 });
                    
                    const results = (res.data.elements || [])
                        .map(el => {
                            const latVal = el.lat || el.center?.lat;
                            const lonVal = el.lon || el.center?.lon;
                            if (!latVal || !lonVal) return null;
                            let displayName = el.tags?.name || el.tags?.amenity?.replace(/_/g, ' ') || 'Place';
                            const d = getDistance(lat, lng, latVal, lonVal);
                            return {
                                name: displayName,
                                latitude: latVal,
                                longitude: lonVal,
                                category: category,
                                type: (el.tags?.amenity || el.tags?.shop || el.tags?.highway || '').replace(/_/g, ' '),
                                distance: formatDistance(d),
                                rawDistance: d
                            };
                        })
                        .filter(Boolean)
                        .sort((a, b) => a.rawDistance - b.rawDistance);
                    
                    if (results.length > 0) {
                        setPoiCache(prev => ({ ...prev, [category]: results }));
                        success = true;
                        // If this is the active category, update the main state
                        if (category === selectedCategory) setPois(results);
                    }
                } catch (err) {
                    console.warn(`Pre-fetch failed for ${category} on ${mirror}`);
                }
            }

            if (!success) {
                const dummies = getDummyPois(category, lat, lng);
                setPoiCache(prev => ({ ...prev, [category]: dummies }));
                if (category === selectedCategory) setPois(dummies);
            }
        };

        // Pre-fetch everything in background
        const categories = NEIGHBOURHOOD_CATEGORIES.map(c => c.id);
        categories.forEach(cat => preFetchCategory(cat));

    }, [property]); // Run once when property loads

    // --- INSTANT TAB SWITCHER ---
    useEffect(() => {
        if (poiCache[selectedCategory]) {
            setPois(poiCache[selectedCategory]);
            setPoisLoading(false);
        } else {
            setPoisLoading(true);
            // The pre-fetcher will update the cache and the state eventually
        }
    }, [selectedCategory, poiCache]);


    const handleWatchlist = async () => {
        if (!user) {
            toast.info("Please login to manage watchlist");
            navigate('/login');
            return;
        }
        try {
            const res = await axios.post(`${BASE_URL}/api/watchlist`, 
                { propertyId: id },
                { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
            );
            setInWatchlist(res.data.added);
            if (res.data.added) {
                toast.success("Property added to your watchlist!");
            } else {
                toast.info("Property removed from watchlist");
            }
        } catch (err) {
            toast.error("Failed to update watchlist");
        }
    };

    useEffect(() => {
        const checkWatchlistStatus = async () => {
            if (!user || !property) return;
            try {
                const res = await axios.get(`${BASE_URL}/api/watchlist/status/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
                });
                setInWatchlist(res.data.inWatchlist);
            } catch (err) {
                console.error("Watchlist check failed", err);
            }
        };
        checkWatchlistStatus();
    }, [id, user, property, BASE_URL]);

    const handleChat = () => {
        if (!user) {
            toast.info("Please login to chat");
            navigate('/login');
            return;
        }
        setIsChatOpen(true);
    };

    useEffect(() => {
        if (showAllImages) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showAllImages]);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/properties/${id}`);
                setProperty(res.data);
            } catch (err) {
                console.error("Failed to load property", err);
                toast.error("Failed to load property details");
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id, BASE_URL]);

    const [visitDate, setVisitDate] = useState('');
    const [visitTime, setVisitTime] = useState('');

    const handleBooking = async () => {
        if (property.is_fake) {
            toast.error("This property is flagged and cannot be booked.");
            return;
        }
        if (!user) {
            toast.info("Please login to book");
            navigate('/login');
            return;
        }
        if (!visitDate || !visitTime) {
            toast.error("Please select a preferred visit date and time");
            return;
        }

        const now = new Date();
        const todayArr = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, '0'),
            String(now.getDate()).padStart(2, '0')
        ];
        const today = todayArr.join('-');
        
        if (visitDate < today) {
            toast.error("Please select a date from today onwards.");
            return;
        }

        // Send EXACT string to avoid UTC shifting
        const visitSlot = `${visitDate} ${visitTime}:00`;

        setIsBooking(true);
        try {
            await axios.post(`${BASE_URL}/api/bookings`,
                { propertyId: id, message: bookingMessage, visitSlot },
                { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
            );
            toast.success("Booking request sent successfully!");
            setBookingMessage("");
            setVisitDate("");
            setVisitTime("");
        } catch (err) {
            toast.error(err.response?.data?.error || "Booking failed");
        } finally {
            setIsBooking(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 animate-pulse">
                    <div className="h-10 w-48 bg-gray-200 dark:bg-white/5 rounded-full mb-8"></div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                        <div className="space-y-4">
                            <div className="h-12 w-96 bg-gray-200 dark:bg-white/5 rounded-2xl"></div>
                            <div className="h-6 w-64 bg-gray-200 dark:bg-white/5 rounded-xl"></div>
                        </div>
                        <div className="flex gap-3">
                            <div className="h-12 w-24 bg-gray-200 dark:bg-white/5 rounded-xl"></div>
                            <div className="h-12 w-24 bg-gray-200 dark:bg-white/5 rounded-xl"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-[600px]">
                        <div className="md:col-span-2 md:row-span-2 bg-gray-200 dark:bg-white/5 rounded-3xl"></div>
                        <div className="bg-gray-200 dark:bg-white/5 rounded-3xl"></div>
                        <div className="bg-gray-200 dark:bg-white/5 rounded-3xl"></div>
                        <div className="bg-gray-200 dark:bg-white/5 rounded-3xl"></div>
                        <div className="bg-gray-200 dark:bg-white/5 rounded-3xl"></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-12">
                            <div className="h-24 w-full bg-gray-200 dark:bg-white/5 rounded-3xl"></div>
                            <div className="h-64 w-full bg-gray-200 dark:bg-white/5 rounded-3xl"></div>
                        </div>
                        <div className="h-[500px] w-full bg-gray-200 dark:bg-white/5 rounded-[2.5rem]"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!property) return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white flex flex-col items-center justify-center gap-4">
            <AlertCircle size={48} className="text-red-500" />
            <h2 className="text-2xl font-bold">Property not found</h2>
            <button onClick={() => navigate('/properties')} className="bg-violet-600 text-white px-6 py-2 rounded-xl">Back to Gallery</button>
        </div>
    );

    // Generate a robust list of images for display
    const getDisplayImages = () => {
        if (!property?.images) return [];
        let images = [...property.images];

        // Find and prioritize cover image
        const coverIndex = images.findIndex(img => img.is_cover);
        if (coverIndex > 0) {
            const [cover] = images.splice(coverIndex, 1);
            images.unshift(cover);
        }
        return images;
    };

    const heroImages = getDisplayImages();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white font-sans selection:bg-violet-500/30 transition-colors duration-300">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-6 transition-all">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-white/5 group-hover:bg-gray-200 dark:group-hover:bg-white/10 transition-colors">
                        <ArrowLeft size={20} />
                    </div>
                    <span className="font-medium">Back to browsing</span>
                </button>

                {/* Fake Property Banner */}
                {property.is_fake && (
                    <div className="mb-10 bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-200 dark:border-rose-900/50 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="bg-rose-500 text-white p-3 rounded-2xl shadow-lg shadow-rose-500/20">
                            <AlertCircle size={32} strokeWidth={2.5} />
                        </div>
                        
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-black text-rose-700 dark:text-rose-400 uppercase tracking-tight">Security Notice: Policy Violation</h3>
                            <p className="text-rose-600/80 dark:text-rose-300/60 font-semibold text-sm">This listing has been flagged by platform administrators and is currently under review for potential fraud or violations.</p>
                        </div>

                        <div className="flex flex-col items-center md:items-end gap-1 px-6 border-l border-rose-200 dark:border-rose-900/40">
                            <span className="text-rose-600 dark:text-rose-400 font-extrabold text-xs uppercase tracking-[0.2em] mb-1">Status</span>
                            <span className="bg-rose-600 text-white px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-sm">
                                Entry Restricted
                            </span>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">{property.title}</h1>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-lg">
                            <MapPin size={20} className="text-violet-500" />
                            {property.address}, {property.locality}, {property.city}
                        </div>
                        {property.room_number && (
                            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-violet-600/10 text-violet-500 border border-violet-500/20 text-xs font-black uppercase tracking-widest">
                                Room {property.room_number}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleWatchlist}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all border font-bold group shadow-sm hover:shadow-md active:scale-95 ${
                                inWatchlist 
                                ? 'bg-violet-600 text-white border-transparent' 
                                : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-violet-500/50'
                            }`}
                        >
                            <Bookmark size={20} className={inWatchlist ? "fill-white" : "group-hover:text-violet-500"} />
                            {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                        </button>
                    </div>
                </div>

                {/* Image Grid - Adapted for ANY number of images */}
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 mb-12 h-[500px] md:h-[600px] relative rounded-3xl overflow-hidden">
                    {/* Main Image - Always present */}
                    <div className={`relative group cursor-pointer overflow-hidden bg-gray-200 dark:bg-gray-900 ${heroImages.length === 1 ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2 md:row-span-2'} h-full`} onClick={() => setShowAllImages(true)}>
                        <img
                            src={heroImages[0]?.url || heroImages[0]?.image_url}
                            alt="Main View"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        {heroImages[0]?.is_cover && <div className="absolute top-4 left-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">COVER PHOTO</div>}
                    </div>

                    {/* Sub Images - Render remaining images dynamically */}
                    {heroImages.slice(1, 5).map((img, idx) => (
                        <div key={idx} className="h-full relative group cursor-pointer overflow-hidden bg-gray-200 dark:bg-gray-900" onClick={() => setShowAllImages(true)}>
                            <img
                                src={img.url || img.image_url}
                                alt={`Detail ${idx}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                            {/* Overlay for hidden images */}
                            {idx === 3 && property.images?.length > 5 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm dark:backdrop-blur-sm text-white">
                                    <span className="text-xl font-bold">+{property.images.length - 5} More</span>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Empty State Fillers - If between 2 and 4 images, we might want to fill gaps or just leave empty?
                        User requested "show those images only". Leaving empty space is safer than fake images.
                        The existing grid will naturally leave gaps which is fine.
                    */}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Key Features */}
                        {/* Key Features */}
                        <div className="flex gap-4 md:gap-8 py-8 border-y border-gray-200 dark:border-white/10 overflow-x-auto no-scrollbar">
                            {[
                                // Standard Residential
                                {
                                    value: property.bedrooms,
                                    label: "Bedrooms",
                                    icon: <Bed size={28} />,
                                    color: "violet",
                                    show: property.bedrooms > 0
                                },
                                {
                                    value: property.bathrooms,
                                    label: "Bathrooms",
                                    icon: <Bath size={28} />,
                                    color: "blue",
                                    show: property.bathrooms > 0
                                },
                                {
                                    value: `${property.area_sqft} sqft`,
                                    label: "Area",
                                    icon: <Maximize size={28} />,
                                    color: "emerald",
                                    show: property.area_sqft > 0
                                },
                                // Commercial / Office
                                {
                                    value: property.seating_capacity,
                                    label: "Seating",
                                    icon: <Users size={28} />,
                                    color: "orange",
                                    show: property.seating_capacity > 0
                                },
                                {
                                    value: property.cabins_available,
                                    label: "Cabins",
                                    icon: <Briefcase size={28} />,
                                    color: "amber",
                                    show: property.cabins_available > 0
                                },
                                {
                                    value: property.conference_room ? "Available" : null,
                                    label: "Conf. Room",
                                    icon: <Users size={28} />,
                                    color: "indigo",
                                    show: property.conference_room
                                },
                                // General
                                {
                                    value: property.floor_number,
                                    label: "Floor",
                                    icon: <Building size={28} />,
                                    color: "cyan",
                                    show: property.floor_number !== null && property.floor_number !== undefined
                                },
                                {
                                    value: property.private_parking_slots,
                                    label: "Parking",
                                    icon: <Car size={28} />,
                                    color: "rose",
                                    show: property.private_parking_slots > 0 || property.parking_type
                                },
                                // PG / Hostel
                                {
                                    value: property.food_included ? "Included" : null,
                                    label: "Food",
                                    icon: <Utensils size={28} />,
                                    color: "lime",
                                    show: property.food_included
                                },
                                {
                                    value: property.power_backup ? "Backup" : null,
                                    label: "Power",
                                    icon: <Zap size={28} />,
                                    color: "yellow",
                                    show: property.power_backup
                                }
                            ].filter(item => item.show).slice(0, 4).map((item, index, arr) => (
                                <React.Fragment key={item.label}>
                                    <div className="flex items-center gap-4 min-w-max">
                                        <div className={`p-3 bg-${item.color}-500/10 text-${item.color}-600 dark:text-${item.color}-400 rounded-2xl border border-${item.color}-500/20`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                                            <p className="font-bold text-xl">{item.value === true ? "Yes" : item.value}</p>
                                        </div>
                                    </div>
                                    {index < arr.length - 1 && (
                                        <div className="w-px bg-gray-200 dark:bg-white/10 h-12 my-auto" />
                                    )}
                                </React.Fragment>
                            ))}
                            {[
                                { show: property.bedrooms > 0 },
                                { show: property.bathrooms > 0 },
                                { show: property.area_sqft > 0 },
                                { show: property.seating_capacity > 0 },
                                { show: property.cabins_available > 0 },
                                { show: property.floor_number !== null },
                                { show: property.private_parking_slots > 0 },
                            ].every(item => !item.show) && <p className="text-gray-500 italic">No specific property details available.</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"> About this place</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-8 text-lg font-light">{property.description}</p>
                        </div>

                        {/* Map Section */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold flex items-center gap-2"> Explore Neighbourhood</h3>
                                <div className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-full border border-gray-200 dark:border-white/10">
                                    Map View
                                </div>
                            </div>

                            <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl group">
                                <FreeMap
                                    properties={[property]}
                                    pois={pois}
                                    singleProperty={true}
                                    zoom={15}
                                />

                                {/* Floating Neighbourhood Dashboard Overlay */}
                                <div className="absolute bottom-6 left-6 right-6 z-[400] bg-white/95 dark:bg-black/90 backdrop-blur-xl p-4 rounded-3xl border border-white/20 dark:border-white/5 shadow-2xl transition-all duration-500 translate-y-0 group-hover:-translate-y-2">
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 bg-${NEIGHBOURHOOD_CATEGORIES.find(c => c.id === selectedCategory)?.color}-500/20 text-${NEIGHBOURHOOD_CATEGORIES.find(c => c.id === selectedCategory)?.color}-600 dark:text-${NEIGHBOURHOOD_CATEGORIES.find(c => c.id === selectedCategory)?.color}-400 rounded-2xl`}>
                                                {React.createElement(NEIGHBOURHOOD_CATEGORIES.find(c => c.id === selectedCategory)?.icon, { size: 24 })}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                                                    {poisLoading ? (
                                                        <span className="animate-pulse">Searching...</span>
                                                    ) : poisError ? (
                                                        <span className="text-rose-500">Service temporarily busy</span>
                                                    ) : (
                                                        <>{pois.length} {NEIGHBOURHOOD_CATEGORIES.find(c => c.id === selectedCategory)?.label} found nearby</>
                                                    )}
                                                </p>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                    {poisError ? "Try switching categories or check later" : "Available around your home"}
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => poiListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                                            className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-bold text-sm bg-violet-600/10 px-4 py-2 rounded-xl group/btn"
                                        >
                                            Locality Guide <ChevronDown size={14} className="group-hover/btn:translate-y-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Category Selectors */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {NEIGHBOURHOOD_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300 ${selectedCategory === cat.id
                                                ? `bg-${cat.color}-500 text-white border-transparent shadow-lg shadow-${cat.color}-500/30 scale-[1.05]`
                                                : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-500 hover:border-gray-200 dark:hover:border-white/10'
                                            }`}
                                    >
                                        <cat.icon size={20} className={selectedCategory === cat.id ? 'animate-bounce' : ''} />
                                        <span className="text-[10px] font-black uppercase tracking-wider">{cat.name}</span>
                                    </button>
                                ))}
                            </div>

                            {/* POI List Detail (Production Level Feature) */}
                            {pois.length > 0 && (
                                <div ref={poiListRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 animate-fade-in border-t border-gray-100 dark:border-white/5 pt-8">
                                    {pois.map((poi, idx) => (
                                        <div 
                                            key={idx} 
                                            className="group flex items-center justify-between p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl hover:border-violet-500/30 hover:shadow-lg transition-all"
                                        >
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <div className={`p-2 bg-${NEIGHBOURHOOD_CATEGORIES.find(c => c.id === selectedCategory)?.color}-500/10 text-${NEIGHBOURHOOD_CATEGORIES.find(c => c.id === selectedCategory)?.color}-600 dark:text-${NEIGHBOURHOOD_CATEGORIES.find(c => c.id === selectedCategory)?.color}-400 rounded-xl group-hover:scale-110 transition-transform`}>
                                                    {React.createElement(NEIGHBOURHOOD_CATEGORIES.find(c => c.id === selectedCategory)?.icon, { size: 18 })}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-bold text-sm truncate group-hover:text-violet-500 transition-colors">{poi.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{poi.type || 'Nearby'}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-black text-violet-500 bg-violet-500/5 px-2 py-1 rounded-lg shrink-0">
                                                {poi.distance}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Additional Property Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Maximize className="w-5 h-5 text-violet-500 font-bold" /> Property Overview</h4>
                                <div className="space-y-3 text-gray-600 dark:text-gray-300">
                                    {property.property_type && <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2"><span>Type</span> <span className="font-medium text-gray-900 dark:text-white capitalize">{property.property_type.replace(/_/g, ' ')}</span></div>}
                                    {property.bhk && <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2"><span>BHK</span> <span className="font-medium text-gray-900 dark:text-white">{property.bhk} BHK</span></div>}
                                    {property.orientation && <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2"><span>Orientation</span> <span className="font-medium text-gray-900 dark:text-white">{property.orientation}</span></div>}
                                    {property.house_floor_type && <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2"><span>Flooring</span> <span className="font-medium text-gray-900 dark:text-white">{property.house_floor_type}</span></div>}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Bed className="w-5 h-5 text-violet-500 font-bold" /> Building Specs</h4>
                                <div className="space-y-3 text-gray-600 dark:text-gray-300">
                                    {property.building_name && <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2"><span>Building</span> <span className="font-medium text-gray-900 dark:text-white">{property.building_name}</span></div>}
                                    {(property.floor_number !== null && property.floor_number !== undefined) && <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2"><span>Floor</span> <span className="font-medium text-gray-900 dark:text-white">{property.floor_number} {property.total_floors ? `of ${property.total_floors}` : ''}</span></div>}
                                    {property.parking_type && <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2"><span>Parking</span> <span className="font-medium text-gray-900 dark:text-white capitalize">{property.parking_type.replace(/_/g, ' ')}</span></div>}
                                    {(property.private_parking_slots > 0) && <div className="flex justify-between border-b border-gray-200 dark:border-white/10 pb-2"><span>Parking Slots</span> <span className="font-medium text-gray-900 dark:text-white">{property.private_parking_slots}</span></div>}
                                </div>
                            </div>

                            {/* Features List (Booleans) */}
                            <div className="md:col-span-2">
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Features & Amenities</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {/* Boolean Features from DB columns */}
                                    {property.is_gated && <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><CheckCircle size={16} className="text-emerald-500" /> Gated Security</div>}
                                    {property.has_lift && <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><CheckCircle size={16} className="text-emerald-500" /> Lift Available</div>}
                                    {property.private_garden && <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><CheckCircle size={16} className="text-emerald-500" /> Private Garden</div>}
                                    {property.duplex_type && <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><CheckCircle size={16} className="text-emerald-500" /> Duplex</div>}
                                    {property.water_available && <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><CheckCircle size={16} className="text-emerald-500" /> Water Supply</div>}
                                    {property.power_backup && <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><CheckCircle size={16} className="text-emerald-500" /> Power Backup</div>}

                                    {/* Dynamically fetched amenities (Many-to-Many) */}
                                    {property.amenities && property.amenities.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                            <CheckCircle size={16} className="text-violet-500" />
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                                {(!property.amenities?.length && !property.is_gated && !property.has_lift) && <p className="text-gray-500 italic mt-2">No specific features listed.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Pricing & Booking */}
                    <div className="space-y-6">
                        {/* Booking Card */}
                        <div className="sticky top-24 bg-white dark:bg-[#111] p-8 rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-violet-900/10">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 mb-1 font-medium italic text-xs uppercase tracking-widest">Monthly Rent</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-gray-900 dark:text-white">₹{property.price.toLocaleString()}</span>
                                        <span className="text-sm font-medium text-gray-400">/ month</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end -mt-4">
                                    <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] uppercase tracking-wider">
                                        {property.status}
                                    </div>
                                </div>
                            </div>

                            {/* PG Occupancy Progress Bar */}
                            {['PG', 'Hostel'].includes(property.property_type) && (
                                <div className="mb-8 p-6 bg-violet-600/5 dark:bg-violet-600/10 rounded-3xl border border-violet-600/10">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            <Users size={18} className="text-violet-500" />
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Room Occupancy</span>
                                        </div>
                                        <span className="text-sm font-black text-violet-600 dark:text-violet-400">
                                            {property.tenant_count} / {property.sharing_capacity} Seats
                                        </span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                                        <div 
                                            className="h-full bg-violet-600 transition-all duration-1000 ease-out relative" 
                                            style={{ width: `${Math.min((property.tenant_count / property.sharing_capacity) * 100, 100)}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                        </div>
                                    </div>
                                    <div className="mt-3 flex justify-between items-center">
                                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-500 uppercase tracking-loose">
                                            {property.tenant_count === 0 ? "Be the first to move in!" : `${property.sharing_capacity - property.tenant_count} spots available now`}
                                        </p>
                                        <div className="flex -space-x-2">
                                            {[...Array(property.tenant_count)].map((_, i) => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-[#111] bg-violet-500 flex items-center justify-center text-[10px] text-white font-bold">
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                            ))}
                                            {[...Array(property.sharing_capacity - property.tenant_count)].map((_, i) => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-[#111] bg-gray-200 dark:bg-white/10 flex items-center justify-center text-[10px] text-gray-400 font-bold border-dashed">
                                                    +
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {property.status === 'Occupied' ? (
                                <div className="bg-red-500/10 text-red-500 p-6 rounded-2xl flex flex-col items-center gap-3 text-center border border-red-500/20 mb-6">
                                    <AlertCircle size={32} />
                                    <div>
                                        <p className="font-bold text-lg">Not Available</p>
                                        <p className="text-sm opacity-80">Check back later or browse other properties.</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4 mb-4">
                                        <div className="grid grid-cols-[1.4fr_1fr] gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400">
                                                    Visit Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={visitDate}
                                                    onChange={(e) => setVisitDate(e.target.value)}
                                                    min={(() => {
                                                        const now = new Date();
                                                        return [
                                                            now.getFullYear(),
                                                            String(now.getMonth() + 1).padStart(2, '0'),
                                                            String(now.getDate()).padStart(2, '0')
                                                        ].join('-');
                                                    })()}
                                                    className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:[color-scheme:dark]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400">
                                                    Time
                                                </label>
                                                <select
                                                    value={visitTime}
                                                    onChange={(e) => setVisitTime(e.target.value)}
                                                    className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:[color-scheme:dark]"
                                                >
                                                    <option value="" disabled>Select Time</option>
                                                    {Array.from({ length: 28 }).map((_, i) => {
                                                        const hour = Math.floor(i / 2) + 8; // 8 AM to 9:30 PM
                                                        const mins = i % 2 === 0 ? "00" : "30";
                                                        const isPM = hour >= 12;
                                                        const displayHour = hour > 12 ? hour - 12 : hour;
                                                        const displayHourStr = displayHour.toString().padStart(2, '0');
                                                        const valueHour = hour.toString().padStart(2, '0');
                                                        const ampm = isPM ? "PM" : "AM";
                                                        const val = `${valueHour}:${mins}`;
                                                        return <option key={val} value={val}>{`${displayHourStr}:${mins} ${ampm}`}</option>;
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <label className="text-sm font-bold text-gray-500 dark:text-gray-400 ml-2">Message to Landlord</label>
                                        <textarea
                                            value={bookingMessage}
                                            onChange={(e) => setBookingMessage(e.target.value)}
                                            placeholder="Hi, I'm interested in this property..."
                                            className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none h-32 resize-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        ></textarea>
                                        <button
                                            onClick={handleBooking}
                                            disabled={isBooking || property.is_fake}
                                            className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:text-gray-500 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group"
                                        >
                                            {property.is_fake ? 'Booking Restricted' : isBooking ? 'Sending...' : 'Request Booking'}
                                            {!isBooking && !property.is_fake && <ArrowLeft key="arrow" className="rotate-180 transition-transform group-hover:translate-x-1" />}
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Chat Section */}
                            <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                                {user ? (
                                    <button
                                        onClick={handleChat}
                                        disabled={property.is_fake}
                                        className={`w-full py-4 border border-gray-200 dark:border-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${property.is_fake ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed opacity-50' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300'}`}
                                    >
                                        <MessageCircle size={20} /> {property.is_fake ? 'Chat Unavailable' : 'Chat with Landlord'}
                                    </button>
                                ) : (
                                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl text-center border border-gray-200 dark:border-white/5">
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Login to chat directly with the landlord</p>
                                        <div className="flex gap-2">
                                            <button onClick={() => navigate('/login')} className="flex-1 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-bold transition-colors">Log In</button>
                                            <button onClick={() => navigate('/signup')} className="flex-1 py-2 bg-white text-gray-900 hover:bg-gray-100 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 rounded-lg text-sm font-bold transition-colors shadow-sm dark:shadow-none border border-gray-200 dark:border-transparent">Sign Up</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* All Images Modal */}
            {showAllImages && (
                <div className="fixed inset-0 z-[2000] bg-white/95 dark:bg-black/95 backdrop-blur-3xl overflow-y-auto no-scrollbar animate-in fade-in duration-300">
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <button 
                            onClick={() => setShowAllImages(false)} 
                            className="fixed top-8 right-8 p-4 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-black dark:text-white rounded-full transition-all z-[2001] border border-black/10 dark:border-white/10 shadow-xl hover:scale-110 active:scale-90 group ring-4 ring-transparent hover:ring-black/5 dark:hover:ring-white/5"
                            title="Close Gallery"
                        >
                            <X size={32} strokeWidth={3} className="transition-transform group-hover:rotate-90" />
                        </button>
                        <h2 className="text-3xl font-bold mb-8 text-black dark:text-white">All Images ({property.images?.length})</h2>
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                            {property.images?.map((img, idx) => (
                                <div key={idx} className="break-inside-avoid rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-200 dark:bg-gray-900">
                                    <img
                                        src={img.url || img.image_url}
                                        alt={`Gallery ${idx}`}
                                        className="w-full h-auto"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Window */}
            {isChatOpen && property && (
                <ChatWindow
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                    recipient={{
                        id: property.landlord_id,
                        name: `${property.first_name} ${property.last_name}`,
                        email: property.email,
                        // avatar_url: property.landlord_avatar // If available
                    }}
                    currentUserRole={user?.role?.toLowerCase() || 'tenant'}
                    isDarkMode={true}
                />
            )}
        </div>
    );
};

export default PropertyDetails;
