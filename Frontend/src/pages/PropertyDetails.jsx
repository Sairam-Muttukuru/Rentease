import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { MapPin, Bed, Bath, Maximize, ArrowLeft, Star, Heart, Share2, CheckCircle, AlertCircle, MessageCircle, X, Users, Briefcase, Building, Car, Utensils, Zap, GraduationCap, HeartPulse, Train, ShoppingBag, Store, ChevronDown } from 'lucide-react';
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

    const NEIGHBOURHOOD_CATEGORIES = [
        { id: 'education', name: 'Education', icon: GraduationCap, color: 'violet', label: 'Schools & Colleges' },
        { id: 'healthcare', name: 'Healthcare', icon: HeartPulse, color: 'rose', label: 'Hospitals & Clinics' },
        { id: 'commute', name: 'Commute', icon: Train, color: 'blue', label: 'Metro & Bus' },
        { id: 'food', name: 'Food & Drinks', icon: Utensils, color: 'orange', label: 'Restaurants' },
        { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'emerald', label: 'Malls & Stores' },
    ];

    const getMockPOIs = (category, lat, lng) => {
        // Simple deterministic "random" based on lat/lng to keep it consistent
        const seed = (lat + lng) * 1000;
        const pseudoRandom = (offset) => Math.abs(Math.sin(seed + offset));

        const pois = {
            education: [
                { name: "Royal Global School", distance: "450m", latitude: lat + 0.002, longitude: lng + 0.003, category: 'education' },
                { name: "City Institute of Tech", distance: "1.2km", latitude: lat - 0.005, longitude: lng + 0.004, category: 'education' },
                { name: "Sunshine Preschool", distance: "800m", latitude: lat + 0.004, longitude: lng - 0.002, category: 'education' },
            ],
            healthcare: [
                { name: "Apollo Specialty Clinics", distance: "300m", latitude: lat + 0.001, longitude: lng - 0.002, category: 'healthcare' },
                { name: "General Medical Center", distance: "2.5km", latitude: lat - 0.008, longitude: lng - 0.005, category: 'healthcare' },
                { name: "24/7 Wellness Pharmacy", distance: "150m", latitude: lat + 0.0005, longitude: lng + 0.001, category: 'healthcare' },
            ],
            commute: [
                { name: "Central Metro Station", distance: "600m", latitude: lat + 0.003, longitude: lng + 0.005, category: 'commute' },
                { name: "City Transit Bus Hub", distance: "1.1km", latitude: lat - 0.004, longitude: lng + 0.006, category: 'commute' },
            ],
            food: [
                { name: "The Spice Garden", distance: "200m", latitude: lat - 0.001, longitude: lng - 0.001, category: 'food' },
                { name: "Urban Brew Coffee", distance: "500m", latitude: lat + 0.002, longitude: lng - 0.003, category: 'food' },
                { name: "Quick Bites Pizzeria", distance: "850m", latitude: lat - 0.003, longitude: lng + 0.002, category: 'food' },
            ],
            shopping: [
                { name: "Grand Plaza Mall", distance: "1.5km", latitude: lat + 0.007, longitude: lng + 0.008, category: 'shopping' },
                { name: "Fresh Mart Grocery", distance: "400m", latitude: lat - 0.002, longitude: lng + 0.003, category: 'shopping' },
                { name: "Trendz Fashion Street", distance: "900m", latitude: lat + 0.005, longitude: lng - 0.001, category: 'shopping' },
            ]
        };
        return pois[category] || [];
    };

    const activePOIs = property ? getMockPOIs(selectedCategory, parseFloat(property.latitude), parseFloat(property.longitude)) : [];


    const handleChat = () => {
        if (!user) {
            toast.info("Please login to chat");
            navigate('/login');
            return;
        }
        setIsChatOpen(true);
    };

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await axios.get(`api/properties/${id}`);
                setProperty(res.data);
            } catch (err) {
                console.error("Failed to load property", err);
                toast.error("Failed to load property details");
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const [visitDate, setVisitDate] = useState('');
    const [visitTime, setVisitTime] = useState('');

    const handleBooking = async () => {
        if (!user) {
            toast.info("Please login to book");
            navigate('/login');
            return;
        }
        if (!visitDate || !visitTime) {
            toast.error("Please select a preferred visit date and time");
            return;
        }

        const visitSlot = new Date(`${visitDate}T${visitTime}`).toISOString();

        setIsBooking(true);
        try {
            await axios.post('api/bookings',
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

    if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white flex items-center justify-center">Loading...</div>;
    if (!property) return <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white flex items-center justify-center">Property not found</div>;

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

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">{property.title}</h1>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-lg">
                            <MapPin size={20} className="text-violet-500" />
                            {property.address}, {property.locality}, {property.city}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-all border border-gray-200 dark:border-white/10 font-medium">
                            <Share2 size={20} /> Share
                        </button>
                        <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-all border border-gray-200 dark:border-white/10 font-medium text-pink-500 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/20">
                            <Heart size={20} /> Save
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
                                    pois={activePOIs}
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
                                                    {activePOIs.length} {NEIGHBOURHOOD_CATEGORIES.find(c => c.id === selectedCategory)?.label}
                                                </p>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Available around your home</p>
                                            </div>
                                        </div>
                                        <button className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-bold text-sm bg-violet-600/10 px-4 py-2 rounded-xl group/btn">
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
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 mb-1">Monthly Rent</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold text-gray-900 dark:text-white">₹{property.price.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-sm font-bold border border-green-500/20">
                                    {property.status}
                                </div>
                            </div>

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
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400">
                                                    Visit Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={visitDate}
                                                    onChange={(e) => setVisitDate(e.target.value)}
                                                    min={new Date().toLocaleDateString('en-CA')}
                                                    className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:[color-scheme:dark]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400">
                                                    Time
                                                </label>
                                                <input
                                                    type="time"
                                                    value={visitTime}
                                                    onChange={(e) => setVisitTime(e.target.value)}
                                                    className="w-full bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:[color-scheme:dark]"
                                                />
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
                                            disabled={isBooking}
                                            className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:text-gray-500 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group"
                                        >
                                            {isBooking ? 'Sending...' : 'Request Booking'}
                                            {!isBooking && <ArrowLeft key="arrow" className="rotate-180 transition-transform group-hover:translate-x-1" />}
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Chat Section */}
                            <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                                {user ? (
                                    <button
                                        onClick={handleChat}
                                        className="w-full py-4 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-gray-600 dark:text-gray-300 font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <MessageCircle size={20} /> Chat with Landlord
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
                <div className="fixed inset-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-xl overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <button onClick={() => setShowAllImages(false)} className="fixed top-8 right-8 p-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full text-black dark:text-white transition-all z-50">
                            <X size={24} />
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
