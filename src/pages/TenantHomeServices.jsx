import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Search, Shield, Star, Clock, CheckCircle2,
    PaintBucket, Hammer, Truck, Zap, Droplets,
    Sofa, Sparkles, ChevronRight, X, Calendar,
    CreditCard, ArrowRight, Home, Menu, LayoutGrid, ChevronLeft, Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

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

export default function TenantHomeServices({ toggleSidebar }) {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const location = useLocation();

    // State
    const [viewState, setViewState] = useState('CATEGORIES'); // CATEGORIES, TYPES, SUB_TYPES, SERVICES
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [subTypes, setSubTypes] = useState([]); // Sub-Service Types
    const [services, setServices] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedSubType, setSelectedSubType] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [bookingStep, setBookingStep] = useState(0); // 0: None, 1: Details, 2: Success

    // Fetch Categories on Mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/tenants/catalog/categories', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCategories(res.data);

            // Check for incoming category from navigation state
            if (location.state?.category) {
                const targetCategory = res.data.find(c =>
                    c.name.toLowerCase() === location.state.category.toLowerCase()
                );
                if (targetCategory) {
                    handleCategoryClick(targetCategory);
                }
            }
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
            const res = await axios.get(`http://localhost:5000/api/tenants/catalog/types/${categoryId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
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
            // Reusing the same endpoint structure, assuming tenant controller routes exist or proxy through general catalog
            // We need to ensure TenantController has getSubTypes. 
            // Wait, I need to check TenantController.js. 
            // It likely needs an update to expose getSubTypes. 
            // For now, I will optimistically implement this and then fix the backend controller.
            const res = await axios.get(`http://localhost:5000/api/tenants/catalog/sub-types/${typeId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSubTypes(res.data);
            setViewState('SUB_TYPES');
        } catch (error) {
            console.error("Error fetching sub-types:", error);
            toast.error("Failed to load sub-service types.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchServices = async (subTypeId) => {
        setIsLoading(true);
        try {
            // Updated endpoint to fetch by sub-type
            const res = await axios.get(`http://localhost:5000/api/tenants/catalog/services-by-subtype/${subTypeId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
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
        if (viewState === 'SERVICES') {
            setViewState('SUB_TYPES');
            setSelectedService(null);
        } else if (viewState === 'SUB_TYPES') {
            setViewState('TYPES');
            setSelectedSubType(null);
        } else if (viewState === 'TYPES') {
            setViewState('CATEGORIES');
            setSelectedCategory(null);
        }
    };

    const handleBookNow = (service) => {
        setSelectedService(service);
        setBookingStep(1);
    };

    const confirmBooking = () => {
        setTimeout(() => {
            setBookingStep(2);
            toast.success(`Booking Confirmed for ${selectedService.name}!`);
        }, 1500);
    };

    const closeModals = () => {
        setBookingStep(0);
        setSelectedService(null);
    };

    // Helper to get Icon
    const getIcon = (iconName) => {
        const Icon = ICON_MAP[iconName] || LayoutGrid;
        return <Icon size={24} />;
    };

    return (
        <div className={`space-y-8 animate-in fade-in duration-700 min-h-screen pb-20`}>

            {/* Header & Navigation */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 md:p-12 text-white shadow-2xl transition-all duration-500">
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-4 mb-4">
                        {viewState !== 'CATEGORIES' && (
                            <button
                                onClick={handleBack}
                                className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                            {viewState === 'CATEGORIES' && "Expert Home Services"}
                            {viewState === 'TYPES' && selectedCategory?.name}
                            {viewState === 'SUB_TYPES' && selectedType?.name}
                            {viewState === 'SERVICES' && selectedSubType?.name}
                        </h1>
                    </div>

                    <p className="text-lg text-violet-100 mb-8 font-medium">
                        {viewState === 'CATEGORIES' && "Quality repairs, cleaning, and maintenance at your fingertips."}
                        {viewState === 'TYPES' && selectedCategory?.description}
                        {viewState === 'SUB_TYPES' && selectedType?.description}
                        {viewState === 'SERVICES' && selectedSubType?.description}
                    </p>

                    {viewState === 'CATEGORIES' && (
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search for categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-900 font-bold placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/30 shadow-lg"
                            />
                        </div>
                    )}
                </div>

                {/* Decor */}
                <div className="absolute top-0 right-0 w-64 h-full hidden md:block opacity-20">
                    <div className="w-full h-full bg-[url('https://cdn-icons-png.flaticon.com/512/2922/2922668.png')] bg-contain bg-no-repeat bg-right-center"></div>
                </div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className={`animate-spin w-12 h-12 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`} />
                </div>
            ) : (
                <>
                    {/* View: CATEGORIES */}
                    {viewState === 'CATEGORIES' && (
                        <div>
                            <div className="flex justify-between items-end mb-6">
                                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Browse Categories</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((category) => (
                                    <div
                                        key={category.id}
                                        onClick={() => handleCategoryClick(category)}
                                        className={`group relative h-72 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-2 ${isDarkMode ? 'border-slate-800' : 'border-white'}`}
                                    >
                                        {/* Background Image */}
                                        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                                            <img
                                                src={category.image_url || CATEGORY_IMAGES[category.name] || CATEGORY_IMAGES.default}
                                                alt={category.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                                        </div>

                                        {/* Content Container */}
                                        <div className="absolute inset-0 p-6 flex flex-col justify-end items-start">
                                            {/* Icon Badge */}
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6
                                                ${isDarkMode ? 'bg-white/10 text-white' : 'bg-white/20 text-white'}
                                            `}>
                                                {getIcon(category.icon_name)}
                                            </div>

                                            <div className="space-y-1">
                                                <h3 className="text-xl font-black text-white tracking-tight transform transition-transform duration-500 group-hover:translate-x-1">
                                                    {category.name}
                                                </h3>
                                                <p className="text-xs text-slate-300 font-medium line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                                    {category.description}
                                                </p>
                                            </div>

                                            {/* Action Indicator */}
                                            <div className="mt-4 flex items-center gap-2 text-white/40 group-hover:text-white transition-colors duration-500">
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Explore</span>
                                                <ArrowRight size={14} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                            </div>
                                        </div>

                                        {/* Premium Shine Effect */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full pointer-events-none transform -skew-x-12"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* View: TYPES (Service Types) */}
                    {viewState === 'TYPES' && (
                        <div>
                            <div className="mb-6">
                                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Select a Service Domain</h2>
                                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Choose a specific domain within {selectedCategory.name}.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {types.map((type) => (
                                    <div
                                        key={type.id}
                                        onClick={() => handleTypeClick(type)}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer hover:shadow-lg transition-all duration-300 group
                                            ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-violet-500' : 'bg-white border-slate-200 hover:border-violet-200'}
                                        `}
                                    >
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                            {type.image_url ? (
                                                <img src={type.image_url} alt={type.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    {getIcon(selectedCategory.icon_name)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{type.name}</h3>
                                            <p className={`text-sm line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{type.description}</p>
                                        </div>
                                        <div className={`ml-auto p-2 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-400'} group-hover:bg-violet-600 group-hover:text-white transition-colors`}>
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                ))}
                                {types.length === 0 && (
                                    <div className={`col-span-full py-12 text-center rounded-3xl border border-dashed ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-500'}`}>
                                        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                            <Search size={24} />
                                        </div>
                                        <p>No service types found for this category.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* View: SUB_TYPES (Sub-Service Types) */}
                    {viewState === 'SUB_TYPES' && (
                        <div>
                            <div className="mb-6">
                                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Select a Specific Service Type</h2>
                                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Refine your search within {selectedType.name}.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {subTypes.map((subType) => (
                                    <div
                                        key={subType.id}
                                        onClick={() => handleSubTypeClick(subType)}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer hover:shadow-lg transition-all duration-300 group
                                            ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-violet-500' : 'bg-white border-slate-200 hover:border-violet-200'}
                                        `}
                                    >
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                            {subType.image_url ? (
                                                <img src={subType.image_url} alt={subType.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    {getIcon(selectedCategory.icon_name)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{subType.name}</h3>
                                            <p className={`text-sm line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{subType.description}</p>
                                        </div>
                                        <div className={`ml-auto p-2 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-400'} group-hover:bg-violet-600 group-hover:text-white transition-colors`}>
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                ))}
                                {subTypes.length === 0 && (
                                    <div className={`col-span-full py-12 text-center rounded-3xl border border-dashed ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-500'}`}>
                                        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                            <Search size={24} />
                                        </div>
                                        <p>No sub-service types found for this type.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* View: SERVICES */}
                    {viewState === 'SERVICES' && (
                        <div>
                            <div className="mb-6">
                                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Available Services</h2>
                                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Select a service to view details and book.</p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {services.map((service) => (
                                    <div key={service.id} className={`rounded-3xl border overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col h-full ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                                        <div className="h-56 overflow-hidden relative">
                                            <img src={service.image_url} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                                <Star size={12} fill="currentColor" className="text-amber-400" /> 4.8
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{service.name}</h3>
                                            <p className={`text-sm mb-4 flex-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{service.description}</p>

                                            {/* Features/Highlights */}
                                            {service.features && (
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {JSON.parse(JSON.stringify(service.features)).slice(0, 3).map((f, i) => (
                                                        <span key={i} className={`text-xs px-2 py-1 rounded-md font-medium ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                                            {f}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center pt-4 border-t border-dashed border-slate-200 dark:border-slate-700 mt-auto">
                                                <div>
                                                    <p className={`text-xs uppercase font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Price</p>
                                                    <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>${service.base_price}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleBookNow(service)}
                                                    className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg shadow-violet-500/20 active:scale-95 transition-all flex items-center gap-2"
                                                >
                                                    Book <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {services.length === 0 && (
                                    <div className={`col-span-full py-12 text-center rounded-3xl border border-dashed ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-500'}`}>
                                        <p>No active services found for this sub-type.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Booking Confirmation / Status Modal */}
            {bookingStep > 0 && selectedService && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>

                        {bookingStep === 1 ? (
                            // STEP 1: REVIEW
                            <>
                                <div className="relative h-32 bg-slate-100 dark:bg-slate-800">
                                    <img src={selectedService.image_url} className="w-full h-full object-cover opacity-50" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                                            <Shield size={32} className="text-emerald-500" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 text-center">
                                    <h3 className={`text-2xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Confirm Booking</h3>
                                    <p className={`text-sm mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>You are booking <span className="font-bold text-violet-500">{selectedService.name}</span>.</p>

                                    <div className={`p-4 rounded-xl text-left mb-8 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm text-slate-500">Service Cost</span>
                                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>${selectedService.base_price}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm text-slate-500">Service Fee</span>
                                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>$5.00</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-dashed border-slate-300 dark:border-slate-700">
                                            <span className="font-bold text-slate-500">Total</span>
                                            <span className="font-black text-xl text-violet-600">${parseFloat(selectedService.base_price) + 5}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={closeModals} className={`py-3 font-bold rounded-xl ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Cancel</button>
                                        <button onClick={confirmBooking} className="py-3 font-bold rounded-xl bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-500/20">Confirm</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            // STEP 2: SUCCESS
                            <div className="p-12 text-center">
                                <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h3 className={`text-3xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Booking Confirmed!</h3>
                                <p className={`text-slate-500 mb-8`}>A professional has been assigned. They will arrive shortly.</p>
                                <button onClick={closeModals} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                                    Done
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
