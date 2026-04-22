import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Search, Shield, Star, Clock, CheckCircle2,
    PaintBucket, Hammer, Truck, Zap, Droplets,
    Sofa, Sparkles, ChevronRight, X, Calendar,
    CreditCard, ArrowRight, Home, Menu, LayoutGrid, ChevronLeft, Loader2, MessageSquare,
    ShoppingBag, Trash2, XCircle, Eye, Wrench
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import BASE_URL from '../utils/apiConfig';
import { stripePromise } from '../stripe';
import ServicePaymentModal from '../components/ServicePaymentModal';

// Icon Mapping
const ICON_MAP = {
    Sparkles, PaintBucket, Droplets, Zap, Hammer, Truck, Sofa, Home, LayoutGrid
};

// Category Images Map
const CATEGORY_IMAGES = {
    'Ac and Appliance repair': '/ac.png',
    'Carpentry': '/carpentry.png',
    'Electrical': '/electrical.png',
    'Home Cleaning': '/cleaning.png',
    'Interior & Renovation': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
    'Painting': '/painting.png',
    'Plumbing': '/plumbing.png',
    'default': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop'
};

export default function LandlordHomeServices({ user = {} }) {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const location = useLocation();
    const navigate = useNavigate();

    // State
    const [viewState, setViewState] = useState('CATEGORIES'); // CATEGORIES, TYPES, SUB_TYPES, SERVICES
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [subTypes, setSubTypes] = useState([]); 
    const [services, setServices] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedSubType, setSelectedSubType] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [bookingStep, setBookingStep] = useState(0); // 0: None, 1: Details, 2: Success
    const [visitDate, setVisitDate] = useState('');
    const [visitTime, setVisitTime] = useState('10:00');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [serviceAddress, setServiceAddress] = useState('');

    // Service Payment State
    const [payingBooking, setPayingBooking] = useState(null);
    const [isPayingService, setIsPayingService] = useState(false);

    // Receipt Preview State
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Shopping Bag (Cart) State
    const [myBookings, setMyBookings] = useState([]);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancellingBookingId, setCancellingBookingId] = useState(null);
    const [cancelReason, setCancelReason] = useState('');

    // Fetch Categories on Mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/tenants/catalog/categories`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTypes = async (categoryId) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/tenants/catalog/types/${categoryId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            setTypes(res.data);
            setViewState('TYPES');
        } catch (error) {
            console.error("Error fetching types:", error);
            toast.error("Failed to load service types.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSubTypes = async (typeId) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/tenants/catalog/sub-types/${typeId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            const fetchedSubTypes = res.data;
            setSubTypes(fetchedSubTypes);

            if (fetchedSubTypes.length === 0) {
                fetchServicesByType(typeId);
            } else {
                setViewState('SUB_TYPES');
            }
        } catch (error) {
            console.error("Error fetching sub-types:", error);
            toast.error("Failed to load sub-service types.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchServicesByType = async (typeId) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/tenants/catalog/services/${typeId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            setServices(res.data);
            setViewState('SERVICES');
        } catch (error) {
            console.error("Error fetching services by type:", error);
            toast.error("Failed to load services.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchServices = async (subTypeId) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/tenants/catalog/services-by-subtype/${subTypeId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            setServices(res.data);
            setViewState('SERVICES');
        } catch (error) {
            console.error("Error fetching services:", error);
            toast.error("Failed to load services.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        fetchTypes(category.id);
    };

    const handleTypeClick = (type) => {
        setSelectedType(type);
        fetchSubTypes(type.id);
    };

    const handleSubTypeClick = (subType) => {
        setSelectedSubType(subType);
        fetchServices(subType.id);
    };

    const handleBack = () => {
        if (viewState === 'MY_BOOKINGS') {
            setViewState('CATEGORIES');
            return;
        }
        if (viewState === 'SERVICES') {
            if (!subTypes || subTypes.length === 0) setViewState('TYPES');
            else setViewState('SUB_TYPES');
            setSelectedService(null);
            setSelectedSubType(null);
        } else if (viewState === 'SUB_TYPES') {
            setViewState('TYPES');
            setSelectedSubType(null);
        } else if (viewState === 'TYPES') {
            setViewState('CATEGORIES');
            setSelectedCategory(null);
        }
    };

    const fetchMyBookings = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/tenants/service-requests`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            setMyBookings(res.data);
            setViewState('MY_BOOKINGS');
        } catch (error) {
            console.error("Error fetching bookings:", error);
            toast.error("Failed to load your bookings.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelBooking = async () => {
        if (!cancelReason.trim()) {
            toast.error("Please provide a reason for cancellation.");
            return;
        }
        setIsLoading(true);
        try {
            await axios.post(`${BASE_URL}/api/tenants/service-requests/${cancellingBookingId}/cancel`,
                { reason: cancelReason },
                { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
            );
            toast.success("Booking cancelled successfully.");
            setIsCancelModalOpen(false);
            setCancelReason('');
            fetchMyBookings();
        } catch (error) {
            console.error("Cancellation error:", error);
            toast.error(error.response?.data?.error || "Failed to cancel booking.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBookNow = (service) => {
        setSelectedService(service);
        const todayStr = new Date().toLocaleDateString('en-CA');
        setVisitDate(todayStr);
        setPaymentMethod('COD');
        setServiceAddress(''); // Landlord needs to provide address
        setBookingStep(1);
    };

    const handlePayNow = async (booking) => {
        setPayingBooking(booking);
    };

    const handlePreviewReceipt = async (receiptNumber) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${BASE_URL}/api/payment/download-service-receipt/${receiptNumber}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
                responseType: 'blob'
            });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            setPreviewUrl(url);
            setIsPreviewOpen(true);
        } catch (error) {
            console.error("Preview failed:", error);
            toast.error("Failed to load receipt preview.");
        } finally {
            setIsLoading(false);
        }
    };

    const confirmBooking = async () => {
        if (!visitDate) {
            toast.error('Please select a visit date.');
            return;
        }
        if (!serviceAddress.trim()) {
            toast.error('Please provide the service location address.');
            return;
        }

        setIsLoading(true);
        try {
            const bookingData = {
                service_id: selectedService.id,
                provider_id: selectedService.provider_id,
                amount: selectedService.price || selectedService.base_price,
                booking_date: visitDate,
                booking_time: visitTime,
                address: serviceAddress,
                service_type: selectedService.name || selectedCategory?.name || "Home Service",
                priority: "Normal",
                payment_method: paymentMethod
            };

            const res = await axios.post(`${BASE_URL}/api/tenants/service-request`, bookingData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });

            if (res.status === 201) {
                setBookingStep(2);
                toast.success(`Booking Confirmed for ${selectedService.name}!`);
            }
        } catch (error) {
            console.error("Booking Error:", error);
            toast.error(error.response?.data?.error || "Failed to confirm booking.");
        } finally {
            setIsLoading(false);
        }
    };


    const closeModals = () => {
        setBookingStep(0);
        setSelectedService(null);
        setVisitDate('');
        setVisitTime('10:00');
    };

    const handleClosePreview = () => {
        if (previewUrl) window.URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setIsPreviewOpen(false);
    };

    const getIcon = (iconName) => {
        const Icon = ICON_MAP[iconName] || LayoutGrid;
        return <Icon size={24} />;
    };

    return (
        <div className={`space-y-8 animate-in fade-in duration-700 min-h-screen pb-20`}>

            {/* Header & Navigation */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 md:p-12 text-white shadow-2xl transition-all duration-500">
                <div className="relative z-10 max-w-4xl w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div className="flex items-center gap-4">
                            {viewState !== 'CATEGORIES' && (
                                <button onClick={handleBack} className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all">
                                    <ChevronLeft size={24} />
                                </button>
                            )}
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                                {viewState === 'CATEGORIES' && "Professional Property Services"}
                                {viewState === 'TYPES' && selectedCategory?.name}
                                {viewState === 'SUB_TYPES' && selectedType?.name}
                                {viewState === 'SERVICES' && selectedSubType?.name}
                                {viewState === 'MY_BOOKINGS' && "My Service Bookings"}
                            </h1>
                        </div>

                        {(viewState === 'CATEGORIES' || viewState === 'TYPES' || viewState === 'SUB_TYPES' || viewState === 'SERVICES') && (
                            <button onClick={fetchMyBookings} className="flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all w-fit">
                                <ShoppingBag size={20} />
                                <span>My Bookings</span>
                            </button>
                        )}
                    </div>

                    <p className="text-lg text-emerald-50 mb-8 font-medium">
                        {viewState === 'CATEGORIES' && "Maintain your property with our verified pool of licensed experts."}
                        {viewState === 'MY_BOOKINGS' && "Manage professional maintenance for your properties."}
                    </p>

                    {viewState === 'CATEGORIES' && (
                        <div className="relative group max-w-2xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search for maintenance services..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-900 font-bold placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 shadow-lg"
                            />
                        </div>
                    )}
                </div>
                <div className="absolute top-0 right-0 w-64 h-full hidden md:block opacity-20">
                    <div className="w-full h-full bg-[url('https://cdn-icons-png.flaticon.com/512/2922/2922668.png')] bg-contain bg-no-repeat bg-right-center"></div>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className={`animate-spin w-12 h-12 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                </div>
            ) : (
                <>
                    {/* View: CATEGORIES */}
                    {viewState === 'CATEGORIES' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((category) => (
                                <div
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category)}
                                    className={`group relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-2 ${isDarkMode ? 'border-slate-800' : 'border-white'}`}
                                >
                                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                                        <img src={category.image_url || CATEGORY_IMAGES[category.name] || CATEGORY_IMAGES.default} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                                    </div>
                                    <div className="absolute inset-0 p-6 flex flex-col justify-end items-start">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${isDarkMode ? 'bg-white/10 text-white' : 'bg-white/20 text-white'}`}>
                                            {getIcon(category.icon_name)}
                                        </div>
                                        <h3 className="text-xl font-black text-white tracking-tight transform transition-transform duration-500 group-hover:translate-x-1">{category.name}</h3>
                                        <p className="text-xs text-slate-300 font-medium line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">{category.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {viewState === 'TYPES' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {types.map((type) => (
                                <div key={type.id} onClick={() => handleTypeClick(type)} className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer hover:shadow-lg transition-all duration-300 group ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-emerald-500' : 'bg-white border-slate-200 hover:border-emerald-500'}`}>
                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                        <img src={type.image_url || "/placeholder.png"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{type.name}</h3>
                                        <p className={`text-sm line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{type.description}</p>
                                    </div>
                                    <div className={`p-2 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-400'} group-hover:bg-emerald-600 group-hover:text-white transition-colors`}>
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {viewState === 'SUB_TYPES' && (
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {subTypes.map((subType) => (
                                <div key={subType.id} onClick={() => handleSubTypeClick(subType)} className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer hover:shadow-lg transition-all duration-300 group ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-emerald-500' : 'bg-white border-slate-200 hover:border-emerald-500'}`}>
                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                        <img src={subType.image_url || "/placeholder.png"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{subType.name}</h3>
                                        <p className={`text-sm line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{subType.description}</p>
                                    </div>
                                    <div className={`p-2 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-400'} group-hover:bg-emerald-600 group-hover:text-white transition-colors`}>
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {viewState === 'SERVICES' && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div key={service.id} className={`rounded-3xl border overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col h-full ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                                    <div className="h-56 overflow-hidden relative">
                                        <img src={service.image_url} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                            <Shield size={12} className="text-emerald-500" /> Professional
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{service.name}</h3>
                                        <p className={`text-sm mb-4 flex-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{service.description}</p>
                                        <div className="flex justify-between items-center pt-4 border-t border-dashed border-slate-200 dark:border-slate-700 mt-auto">
                                            <div>
                                                <p className={`text-xs uppercase font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Base Price</p>
                                                <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{service.base_price}</p>
                                            </div>
                                            <button onClick={() => handleBookNow(service)} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2">
                                                Book Service <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {viewState === 'MY_BOOKINGS' && (
                        <div className="space-y-4">
                            {myBookings.length === 0 ? (
                                <div className={`py-20 text-center rounded-[40px] border-2 border-dashed ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
                                    <ShoppingBag size={48} className="mx-auto mb-4 text-slate-400" />
                                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>No Services Booked</h3>
                                    <p className="text-slate-500 mb-6">Maintain your properties by hiring expert help.</p>
                                    <button onClick={() => setViewState('CATEGORIES')} className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black shadow-lg">Browse Services</button>
                                </div>
                            ) : (
                                myBookings.map((booking) => (
                                    <div key={booking.id} className={`group relative overflow-hidden rounded-[32px] border transition-all duration-300 p-6 flex flex-col md:flex-row items-center gap-6 ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:border-emerald-500/50' : 'bg-white border-slate-100 hover:border-emerald-200 shadow-xl shadow-slate-200/50'}`}>
                                        <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                                            <img src={booking.image_url || CATEGORY_IMAGES.default} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${booking.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>{booking.status}</span>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>#{booking.id}</span>
                                            </div>
                                            <h3 className={`text-xl font-black mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{booking.service_name}</h3>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-slate-500">
                                                <div className="flex items-center gap-1.5"><Calendar size={14} className="text-emerald-500" />{new Date(booking.booking_date).toLocaleDateString()}</div>
                                                <div className="flex items-center gap-1.5"><Clock size={14} className="text-emerald-500" />{booking.booking_time}</div>
                                            </div>
                                            <p className="mt-2 text-xs text-slate-400 italic">📍 {booking.address}</p>
                                        </div>
                                        <div className="flex flex-col items-center md:items-end gap-3 min-w-[120px]">
                                            <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>₹{booking.amount}</p>
                                            {booking.status === 'Completed' && booking.payment_method === 'Online' && booking.service_payment_status !== 'PAID' && (
                                                <button onClick={() => handlePayNow(booking)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-lg active:scale-95 transition-all">
                                                    <CreditCard size={15} /> Pay Now
                                                </button>
                                            )}
                                            {booking.status === 'Completed' && booking.payment_method === 'Online' && booking.service_payment_status === 'PAID' && (
                                                <div className="flex items-center gap-2">
                                                    <span className="px-4 py-1.5 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase rounded-full">✔ Paid Online</span>
                                                    <button onClick={() => handlePreviewReceipt(booking.service_receipt_number)} className="p-2 bg-slate-100 rounded-lg text-slate-500 hover:text-emerald-600 transition-colors"><Eye size={16} /></button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Booking Modal */}
            {bookingStep === 1 && selectedService && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className={`w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                        <div className="h-32 bg-emerald-500/10 flex items-center justify-center">
                            <Shield size={48} className="text-emerald-500" />
                            <button onClick={closeModals} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8">
                            <h3 className={`text-2xl font-black mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Book Professional Service</h3>
                            <p className="text-emerald-500 font-bold mb-6">{selectedService.name}</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Service Location (Full Address)</label>
                                    <textarea
                                        value={serviceAddress}
                                        onChange={(e) => setServiceAddress(e.target.value)}
                                        placeholder="Enter the property address where service is needed..."
                                        className={`w-full p-4 rounded-2xl border-2 resize-none h-24 font-bold outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-100 text-slate-900 focus:border-emerald-500'}`}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Visit Date</label>
                                        <input type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} min={new Date().toLocaleDateString('en-CA')} className={`w-full p-3 rounded-xl border-2 font-bold outline-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'}`} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Category Price</label>
                                        <div className={`w-full p-3 rounded-xl border-2 font-bold flex items-center gap-2 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                                            <CreditCard size={16} /> ₹{selectedService.base_price}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Payment Preference</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button onClick={() => setPaymentMethod('COD')} className={`p-4 rounded-2xl border-2 font-bold transition-all ${paymentMethod === 'COD' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-transparent bg-slate-100 text-slate-400'}`}>Cash on Delivery</button>
                                        <button onClick={() => setPaymentMethod('Online')} className={`p-4 rounded-2xl border-2 font-bold transition-all ${paymentMethod === 'Online' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 'border-transparent bg-slate-100 text-slate-400'}`}>Online Payment</button>
                                    </div>
                                </div>
                            </div>

                            <button onClick={confirmBooking} className="w-full py-4 mt-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                                Confirm & Book Visit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {bookingStep === 2 && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in zoom-in duration-300">
                    <div className={`w-full max-w-sm p-10 rounded-[40px] text-center ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={48} />
                        </div>
                        <h3 className={`text-2xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Booking Confirmed!</h3>
                        <p className="text-slate-500 mb-8 font-medium">The service provider has been notified and will visit on the scheduled date.</p>
                        <button onClick={() => { closeModals(); fetchMyBookings(); }} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg">View in My Bookings</button>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {payingBooking && (
                <ServicePaymentModal
                    isDarkMode={isDarkMode}
                    onClose={() => setPayingBooking(null)}
                    booking={payingBooking}
                    stripePromise={stripePromise}
                    userName={`${user.first_name || 'Landlord'} ${user.last_name || ''}`}
                    onSuccess={() => fetchMyBookings()}
                />
            )}

            {/* Receipt Modal */}
            {isPreviewOpen && (
                <div className="fixed inset-0 z-[130] flex items-center justify-center md:justify-end md:pr-12 md:pb-8 bg-black/90 backdrop-blur-md transition-all duration-500">
                    {/* Professional Close Button */}
                    <button 
                        onClick={handleClosePreview} 
                        className="fixed top-6 right-6 md:top-10 md:right-10 group flex items-center gap-2 py-2 px-4 bg-slate-900 border border-slate-700 text-white rounded-xl shadow-2xl transition-all hover:bg-slate-800 z-[250]"
                    >
                        <span className="text-xs font-bold uppercase tracking-wider">Close Preview</span>
                        <X size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                    </button>

                    <div className="w-full max-w-5xl h-[90vh] flex flex-col relative animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-4 text-white">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <span className="p-1.5 bg-emerald-500 rounded-lg"><Wrench size={18} /></span>
                                Service Receipt Preview
                            </h3>
                        </div>
                        <iframe src={previewUrl} title="Receipt Preview" className="flex-1 w-full rounded-2xl border-none bg-white shadow-2xl" />
                    </div>
                </div>
            )}
        </div>
    );
}
