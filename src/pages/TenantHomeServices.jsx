import React, { useState } from 'react';
import {
    Search, Shield, Star, Clock, CheckCircle2,
    PaintBucket, Hammer, Truck, Zap, Droplets,
    Sofa, Sparkles, ChevronRight, X, Calendar,
    CreditCard, ArrowRight, Home
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

const SERVICES_DATA = [
    {
        id: 'clean',
        title: 'Home Cleaning',
        icon: Sparkles,
        color: 'bg-emerald-100 text-emerald-600',
        darkColor: 'bg-emerald-500/20 text-emerald-400',
        options: [
            { id: 'full-clean', title: 'Full House Cleaning', price: 149, rating: 4.8, reviews: '2.5k', popular: true, image: 'https://images.unsplash.com/photo-1581578731117-104f2a41272c?q=80&w=2670&auto=format&fit=crop' },
            { id: 'bath-clean', title: 'Bathroom Cleaning', price: 49, rating: 4.7, reviews: '1.2k', popular: false, image: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?q=80&w=2670&auto=format&fit=crop' },
            { id: 'kitchen-clean', title: 'Kitchen Deep Clean', price: 89, rating: 4.9, reviews: '900+', popular: false, image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2670&auto=format&fit=crop' },
            { id: 'sofa-clean', title: 'Sofa Cleaning', price: 39, rating: 4.6, reviews: '3k', popular: false, image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2670&auto=format&fit=crop' }
        ]
    },
    {
        id: 'paint',
        title: 'Painting',
        icon: PaintBucket,
        color: 'bg-blue-100 text-blue-600',
        darkColor: 'bg-blue-500/20 text-blue-400',
        options: [
            { id: 'full-paint', title: 'Full Home Painting', price: 999, rating: 4.9, reviews: '5k', popular: true, image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2670&auto=format&fit=crop' },
            { id: 'wall-paint', title: 'Single Wall Accent', price: 199, rating: 4.7, reviews: '1.2k', popular: false, image: 'https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?q=80&w=2574&auto=format&fit=crop' }
        ]
    },
    {
        id: 'plumb',
        title: 'Plumbing',
        icon: Droplets,
        color: 'bg-cyan-100 text-cyan-600',
        darkColor: 'bg-cyan-500/20 text-cyan-400',
        options: [
            { id: 'leak-fix', title: 'Leak Report & Fix', price: 79, rating: 4.8, reviews: '4k', popular: true, image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=2574&auto=format&fit=crop' },
            { id: 'tap-install', title: 'Tap Installation', price: 49, rating: 4.5, reviews: '800+', popular: false, image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=2670&auto=format&fit=crop' }
        ]
    },
    {
        id: 'electric',
        title: 'Electrical',
        icon: Zap,
        color: 'bg-amber-100 text-amber-600',
        darkColor: 'bg-amber-500/20 text-amber-400',
        options: [
            { id: 'wiring', title: 'Full Wiring Check', price: 129, rating: 4.9, reviews: '2k', popular: true, image: 'https://plus.unsplash.com/premium_photo-1663040329015-0628290f6db6?q=80&w=2670&auto=format&fit=crop' },
            { id: 'fan-install', title: 'Fan/Light Install', price: 39, rating: 4.7, reviews: '3k', popular: false, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2669&auto=format&fit=crop' }
        ]
    },
    {
        id: 'repair',
        title: 'Carpentry',
        icon: Hammer,
        color: 'bg-rose-100 text-rose-600',
        darkColor: 'bg-rose-500/20 text-rose-400',
        options: [
            { id: 'furniture-fix', title: 'Furniture Repair', price: 89, rating: 4.6, reviews: '1k', popular: true, image: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=2673&auto=format&fit=crop' },
            { id: 'drill', title: 'Drill & Hang', price: 29, rating: 4.8, reviews: '5k', popular: false, image: 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?q=80&w=2667&auto=format&fit=crop' }
        ]
    },
    {
        id: 'movers',
        title: 'Packers & Movers',
        icon: Truck,
        color: 'bg-violet-100 text-violet-600',
        darkColor: 'bg-violet-500/20 text-violet-400',
        options: [
            { id: 'local-move', title: 'Local Shifting', price: 299, rating: 4.8, reviews: '3.5k', popular: true, image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?q=80&w=2574&auto=format&fit=crop' },
            { id: 'inter-move', title: 'Inter-city Move', price: 999, rating: 4.7, reviews: '2k', popular: false, image: 'https://images.unsplash.com/photo-1586769852044-692d6e375258?q=80&w=2670&auto=format&fit=crop' }
        ]
    }
];

export default function TenantHomeServices() {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [bookingStep, setBookingStep] = useState(0); // 0: None, 1: Details, 2: Success
    const [selectedService, setSelectedService] = useState(null);

    const handleBookNow = (service) => {
        setSelectedService(service);
        setBookingStep(1);
    };

    const confirmBooking = () => {
        // Mock API call simulation
        setTimeout(() => {
            setBookingStep(2);
            toast.success(`Booking Confirmed for ${selectedService.title}!`);
        }, 1500);
    };

    const closeModals = () => {
        setSelectedCategory(null);
        setBookingStep(0);
        setSelectedService(null);
    };

    return (
        <div className={`space-y-8 animate-in fade-in duration-700`}>

            {/* Search Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 md:p-12 text-white shadow-2xl">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
                        Expert Home Services, <br />
                        <span className="text-violet-200">On Demand.</span>
                    </h1>
                    <p className="text-lg text-violet-100 mb-8 font-medium">Quality repairs, cleaning, and maintenance at your fingertips.</p>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search for 'AC Repair', 'Cleaning'..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-900 font-bold placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-violet-500/30 shadow-lg"
                        />
                    </div>
                </div>

                {/* Decor */}
                <div className="absolute top-0 right-0 w-64 h-full hidden md:block opacity-20">
                    <div className="w-full h-full bg-[url('https://cdn-icons-png.flaticon.com/512/2922/2922668.png')] bg-contain bg-no-repeat bg-right-center"></div>
                </div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            {/* Categories Grid */}
            <div>
                <div className="flex justify-between items-end mb-6">
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Browse Categories</h2>
                    <button className="text-sm font-bold text-violet-500 hover:text-violet-600">View All</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {SERVICES_DATA.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map((category) => (
                        <div
                            key={category.id}
                            onClick={() => setSelectedCategory(category)}
                            className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:shadow-xl
                ${isDarkMode
                                    ? 'bg-slate-800/50 border-slate-700 hover:border-violet-500/50'
                                    : 'bg-white border-slate-200 hover:border-violet-200'}
              `}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${isDarkMode ? category.darkColor : category.color}`}>
                                <category.icon size={24} />
                            </div>
                            <h3 className={`font-bold transition-colors ${isDarkMode ? 'text-slate-200 group-hover:text-white' : 'text-slate-800 group-hover:text-violet-700'}`}>
                                {category.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>

            {/* Promo Banner */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className={`p-8 rounded-3xl flex items-center justify-between relative overflow-hidden group cursor-pointer ${isDarkMode ? 'bg-slate-800' : 'bg-violet-50'}`}>
                    <div className="relative z-10">
                        <span className="bg-emerald-500 text-white text-[10px] uppercase font-black px-2 py-1 rounded mb-2 inline-block">Save 30%</span>
                        <h3 className={`text-2xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Full House<br />Deep Clean</h3>
                        <button className="text-sm font-bold flex items-center gap-1 text-emerald-500 hover:gap-2 transition-all">
                            Book Now <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <Sparkles className={`relative z-10 w-24 h-24 ${isDarkMode ? 'text-slate-700' : 'text-violet-200'} group-hover:rotate-12 transition-transform duration-500`} />
                </div>

                <div className={`p-8 rounded-3xl flex items-center justify-between relative overflow-hidden group cursor-pointer ${isDarkMode ? 'bg-slate-800' : 'bg-amber-50'}`}>
                    <div className="relative z-10">
                        <span className="bg-amber-500 text-white text-[10px] uppercase font-black px-2 py-1 rounded mb-2 inline-block">Best Seller</span>
                        <h3 className={`text-2xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>AC Service<br />& Repair</h3>
                        <button className="text-sm font-bold flex items-center gap-1 text-amber-500 hover:gap-2 transition-all">
                            Book Now <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 bg-amber-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <Zap className={`relative z-10 w-24 h-24 ${isDarkMode ? 'text-slate-700' : 'text-amber-200'} group-hover:rotate-12 transition-transform duration-500`} />
                </div>
            </div>

            {/* Category Modal */}
            {selectedCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className={`w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>

                        {/* Modal Header */}
                        <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isDarkMode ? selectedCategory.darkColor : selectedCategory.color}`}>
                                    <selectedCategory.icon size={24} />
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedCategory.title}</h2>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select a service to book</p>
                                </div>
                            </div>
                            <button onClick={closeModals} className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Services List */}
                        <div className="overflow-y-auto p-6 grid md:grid-cols-2 gap-6">
                            {selectedCategory.options.map((option) => (
                                <div key={option.id} className={`rounded-2xl border overflow-hidden group hover:shadow-xl transition-all duration-300 ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'}`}>
                                    <div className="h-48 overflow-hidden relative">
                                        <img src={option.image} alt={option.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        {option.popular && (
                                            <div className="absolute top-4 left-4 bg-yellow-400 text-slate-900 text-xs font-black px-3 py-1 rounded-full shadow-lg">
                                                POPULAR
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{option.title}</h3>
                                            <div className="flex items-center gap-1 bg-emerald-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                                                <Star size={12} fill="currentColor" /> {option.rating}
                                            </div>
                                        </div>
                                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{option.reviews} reviews • 45-60 mins</p>

                                        <div className="flex justify-between items-center pt-4 border-t border-dashed border-slate-200 dark:border-slate-700">
                                            <div>
                                                <p className={`text-xs uppercase font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Starts from</p>
                                                <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>${option.price}</p>
                                            </div>
                                            <button
                                                onClick={() => handleBookNow(option)}
                                                className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-lg shadow-violet-500/20 active:scale-95 transition-all"
                                            >
                                                Stats
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Booking Confirmation / Status Modal */}
            {bookingStep > 0 && selectedService && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className={`w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>

                        {bookingStep === 1 ? (
                            // STEP 1: REVIEW
                            <>
                                <div className="relative h-32 bg-slate-100">
                                    <img src={selectedService.image} className="w-full h-full object-cover opacity-50" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                                            <Shield size={32} className="text-emerald-500" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 text-center">
                                    <h3 className={`text-2xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Confirm Booking</h3>
                                    <p className={`text-sm mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>You are booking <span className="font-bold text-violet-500">{selectedService.title}</span>.</p>

                                    <div className={`p-4 rounded-xl text-left mb-8 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm text-slate-500">Service Cost</span>
                                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>${selectedService.price}</span>
                                        </div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm text-slate-500">Service Fee</span>
                                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>$5.00</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-dashed border-slate-300 dark:border-slate-700">
                                            <span className="font-bold text-slate-500">Total</span>
                                            <span className="font-black text-xl text-violet-600">${selectedService.price + 5}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => setBookingStep(0)} className={`py-3 font-bold rounded-xl ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Cancel</button>
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
                                    Back to Services
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
