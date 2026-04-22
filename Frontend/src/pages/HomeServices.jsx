import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, Star, ShieldCheck, Clock, Award, ChevronRight, Zap, Droplet, Hammer, Paintbrush, ArrowRight, ArrowLeft, LayoutGrid, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

// --- ICONS MAPPING ---
const ICON_MAP = {
    Fan: Zap, // Fallback/Mapping
    Sparkles: Droplet,
    Zap: Zap,
    Paintbrush: Paintbrush,
    Wrench: Hammer,
    Hammer: Hammer,
    Home: LayoutGrid,
    Star: Star,
    LayoutGrid: LayoutGrid
};

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemAnim = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
};

// --- COMPONENTS ---

const CategoryCard = ({ category, onClick }) => {
    // Map string icon name to Lucide component
    const Icon = ICON_MAP[category.icon_name] || ICON_MAP[category.icon] || LayoutGrid;

    // Color mapping for dynamic classes not supported by Tailwind JIT without safelist, using style or standard colors
    const colorClasses = {
        blue: "bg-blue-500",
        emerald: "bg-emerald-500",
        amber: "bg-amber-500",
        purple: "bg-purple-500",
        indigo: "bg-indigo-500"
    };

    return (
        <motion.div
            variants={itemAnim}
            onClick={() => onClick(category)}
            className="relative group cursor-pointer overflow-hidden rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-64"
        >
            <div className="h-full overflow-hidden relative">
                <img
                    src={category.image_url || category.image || "https://images.unsplash.com/photo-1581578731117-104f2a41272c?q=80&w=2670&auto=format&fit=crop"}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 ${colorClasses[category.color] || 'bg-indigo-500'} text-white rounded-xl shadow-lg ring-4 ring-white/20`}>
                            <Icon size={20} />
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tight">{category.name}</h3>
                    </div>
                    <p className="text-slate-200/80 text-sm font-medium line-clamp-2">
                        {category.description || `Explore ${category.name} services`}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

const TypeSelectionModal = ({ isOpen, onClose, category, types, onSelectType }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[80vh] flex flex-col pointer-events-auto">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                        {category?.image_url ? <img src={category.image_url} className="w-full h-full object-cover rounded-xl" /> : <LayoutGrid size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{category?.name}</h3>
                                        <p className="text-slate-500 text-sm font-bold">Select a service type</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <X size={24} className="text-slate-500" />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto">
                                {types.length === 0 ? (
                                    <div className="text-center py-10 text-slate-500 font-medium">No service types available.</div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {types.map((type) => (
                                            <div
                                                key={type.id}
                                                onClick={() => onSelectType(type)}
                                                className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 cursor-pointer transition-all duration-300"
                                            >
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                                    <img
                                                        src={type.image_url || "https://images.unsplash.com/photo-1581578731117-104f2a41272c?q=80&w=2670&auto=format&fit=crop"}
                                                        alt={type.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors text-lg">{type.name}</h4>
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 flex items-center gap-1 group-hover:gap-2 transition-all">
                                                        View Services <ArrowRight size={12} />
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const ServiceDetailsModal = ({ isOpen, onClose, service, onBook }) => {
    if (!isOpen || !service) return null;

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={e => e.stopPropagation()}
                    className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                >
                    <div className="relative h-64 sm:h-80 bg-slate-200">
                        <img
                            src={service.image_url || "https://images.unsplash.com/photo-1581578731117-104f2a41272c?q=80&w=2670&auto=format&fit=crop"}
                            alt={service.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-colors">
                            <X size={24} />
                        </button>
                        <div className="absolute bottom-0 left-0 w-full p-8">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                                    {service.category_name || "Service"}
                                </span>
                                {service.type_name && (
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full">
                                        {service.type_name}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">{service.name}</h2>
                            {service.provider_name && (
                                <p className="text-white/90 font-bold text-lg mb-2">by {service.provider_name}</p>
                            )}
                            <div className="flex items-center gap-2 text-slate-200 font-bold">
                                <span>₹{service.base_price || service.price}</span>
                                <span>•</span>
                                <div className="flex items-center gap-1 text-emerald-400">
                                    <ShieldCheck size={16} /> Verified Expert
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 overflow-y-auto custom-scrollbar">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">About this Service</h3>
                        <div className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 text-lg">
                            {service.description ? (
                                service.description.includes('•') ? (
                                    <ul className="space-y-2">
                                        {service.description.split('•').filter(p => p.trim()).map((point, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-indigo-500 mt-1.5">•</span>
                                                <span>{point.trim()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>{service.description}</p>
                                )
                            ) : (
                                <p>This service includes a comprehensive assessment and professional execution by verified experts. We ensure high-quality standards and customer satisfaction.</p>
                            )}
                        </div>

                        {service.features && service.features.length > 0 && (
                            <>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">What's Included</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    {service.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                            <div className="p-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full mt-0.5">
                                                <Award size={14} />
                                            </div>
                                            <span className="text-slate-700 dark:text-slate-300 font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Why Choose Us?</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            {[
                                { icon: Clock, title: "On-Time", desc: "Always punctual" },
                                { icon: ShieldCheck, title: "Secure", desc: "Verified pros" },
                                { icon: Star, title: "Top Rated", desc: "4.8+ Average" }
                            ].map((item, i) => (
                                <div key={i} className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30">
                                    <item.icon className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                                    <div className="font-bold text-slate-900 dark:text-white">{item.title}</div>
                                    <div className="text-xs text-slate-500">{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto sticky bottom-0 z-10">
                        <button
                            onClick={() => {
                                onClose();
                                onBook(service);
                            }}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-lg shadow-xl shadow-indigo-500/20 flex justify-center items-center gap-2 transition-all transform active:scale-95"
                        >
                            Book Application Now <ArrowRight size={20} />
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const BookingModal = ({ isOpen, onClose, service, onConfirm, initialAddress }) => {
    if (!isOpen || !service) return null;

    const [formData, setFormData] = useState({
        date: '',
        time: '',
        address: initialAddress || '',
        contact_number: '',
        payment_method: 'COD'
    });

    useEffect(() => {
        if (isOpen && initialAddress) {
            setFormData(prev => ({ ...prev, address: initialAddress }));
        }
    }, [isOpen, initialAddress]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.contact_number && formData.contact_number.length !== 10) {
            toast.error("Contact number must be exactly 10 digits");
            return;
        }

        onConfirm(formData);
    };

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={e => e.stopPropagation()}
                    className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-100 dark:border-slate-800"
                >
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0 bg-slate-50/50 dark:bg-slate-900">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Secure Booking</h3>
                            <p className="text-slate-500 text-xs font-bold mt-1">Complete your request</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <X size={20} className="text-slate-500" />
                        </button>
                    </div>

                    <div className="overflow-y-auto custom-scrollbar p-6 space-y-6">
                        {/* Service Summary */}
                        <div className="flex items-center gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-300 rounded-xl">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-lg">{service.name}</h4>
                                {service.provider_name && <p className="text-xs text-slate-500 font-bold">by {service.provider_name}</p>}
                                <p className="text-indigo-600 dark:text-indigo-400 font-bold">₹{service.base_price || service.price}</p>
                            </div>
                        </div>

                        <form id="booking-form" onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            required
                                            min={new Date().toLocaleDateString('en-CA')}
                                            value={formData.date}
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 transition-colors dark:text-white font-medium"
                                            onChange={e => {
                                                const selected = e.target.value;
                                                if (!selected) return;
                                                // Use midnight-normalised Date objects to avoid locale string bugs
                                                const selectedDate = new Date(selected + 'T00:00:00');
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);
                                                if (selectedDate < today) {
                                                    const todayStr = today.toLocaleDateString('en-CA');
                                                    setFormData({ ...formData, date: todayStr });
                                                    // Use a fixed toastId so it never stacks
                                                    toast.info("Please select a date from today onwards.", { toastId: 'date-warn' });
                                                } else {
                                                    setFormData({ ...formData, date: selected });
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 col-span-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Time Slot</label>
                                    <select
                                        required
                                        value={formData.time}
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 transition-colors dark:text-white font-bold"
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    >
                                        <option value="" disabled>Select Time</option>
                                        {['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','19:30','20:00','21:00'].map(t => {
                                            const [hour, min] = t.split(':');
                                            let h = parseInt(hour, 10);
                                            const ampm = h >= 12 ? 'PM' : 'AM';
                                            const displayH = h % 12 || 12;
                                            return <option key={t} value={t}>{`${displayH}:${min} ${ampm}`}</option>;
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Contact Number</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="10-digit contact number"
                                    value={formData.contact_number}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 transition-colors dark:text-white font-medium"
                                    onChange={e => {
                                        const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setFormData({ ...formData, contact_number: cleaned });
                                    }}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Location Details</label>
                                <textarea
                                    required
                                    placeholder="Enter your complete address..."
                                    value={formData.address}
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 transition-colors min-h-[100px] dark:text-white font-medium resize-none"
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Priority</label>
                                <select
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 transition-colors dark:text-white font-medium"
                                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                    value={formData.priority || "Normal"}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Payment Method</label>
                                <select
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 transition-colors dark:text-white font-medium"
                                    onChange={e => setFormData({ ...formData, payment_method: e.target.value })}
                                    value={formData.payment_method || "COD"}
                                >
                                    <option value="COD">Cash on Delivery (COD)</option>
                                    <option value="Online">Online Payment (Card/UPI)</option>
                                </select>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                                <ShieldCheck size={16} className="text-emerald-600 mt-0.5" />
                                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                                    {formData.payment_method === 'Online'
                                        ? "You will pay securely online after the service provider completes the job."
                                        : "Payment will be collected in cash after service completion. No upfront charge."}
                                </p>
                            </div>
                        </form>
                    </div>

                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                        <button form="booking-form" type="submit" className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-black text-lg shadow-xl shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                            Confirm Booking <ArrowRight size={20} />
                        </button>
                    </div>
                </motion.div>
            </motion.div >
        </AnimatePresence >
    );
};


const ServiceListCard = ({ service, onClick, onBook }) => (
    <motion.div
        variants={itemAnim}
        whileHover={{ scale: 1.01 }}
        className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col sm:flex-row gap-6 hover:shadow-xl transition-all duration-300 cursor-pointer h-full"
        onClick={onClick}
    >
        <div className="w-full sm:w-40 h-40 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
            <img
                src={service.image_url || "https://images.unsplash.com/photo-1581578731117-104f2a41272c?q=80&w=2670&auto=format&fit=crop"}
                alt={service.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-2 left-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm">
                <span className="text-sm font-black text-slate-900 dark:text-white">₹{service.base_price || service.price}</span>
            </div>
        </div>

        <div className="flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                {service.name || service.service_name}
            </h3>
            {service.provider_name && (
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                    Provided by: {service.provider_name}
                </p>
            )}
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                {service.description || "Professional service with verified experts."}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full uppercase tracking-wider">
                        <ShieldCheck size={10} />
                        Verified
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick();
                        }}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        View Details
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onBook(service);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-black uppercase tracking-wider group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm"
                    >
                        Book Now <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    </motion.div>
);

const HomeServices = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const initialAddress = location.state?.address || '';
    const propertyImage = location.state?.property_image || null; // Get property image
    const [searchTerm, setSearchTerm] = useState('');

    // State for Dynamic Data
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [subTypes, setSubTypes] = useState([]);
    const [services, setServices] = useState([]);
    const [featuredServices, setFeaturedServices] = useState([]);
    const [loading, setLoading] = useState(false);

    // UI State
    const [viewState, setViewState] = useState('CATEGORIES'); // CATEGORIES, SERVICES
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [selectedSubType, setSelectedSubType] = useState(null);
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);

    // Booking State
    const [selectedService, setSelectedService] = useState(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    // Details Modal State
    const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    // Initial Fetch: Categories & Featured
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            // Using public endpoints now
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://rentease-1-pwm5.onrender.com'}/api/tenants/catalog/categories`);
            setCategories(res.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTypes = async (categoryId) => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://rentease-1-pwm5.onrender.com'}/api/tenants/catalog/types/${categoryId}`);
            const fetchedTypes = res.data;
            setTypes(fetchedTypes);

            if (fetchedTypes.length > 0) {
                // Automatically select the first type and fetch its services
                handleTypeSelect(fetchedTypes[0]);
            } else {
                setServices([]);
                setViewState('SERVICES');
            }
        } catch (error) {
            console.error("Error fetching types:", error);
            toast.error("Failed to load service types.");
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async (typeId) => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://rentease-1-pwm5.onrender.com'}/api/tenants/catalog/services/${typeId}`);
            setServices(res.data);
            setSubTypes([]);
            setSelectedSubType(null);
            setViewState('SERVICES');
        } catch (error) {
            console.error("Error fetching services:", error);
            toast.error("Failed to load services.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSubTypes = async (typeId) => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://rentease-1-pwm5.onrender.com'}/api/tenants/catalog/sub-types/${typeId}`);
            setSubTypes(res.data);
            setServices([]);
            setSelectedSubType(null);
            setViewState('SERVICES');
        } catch (error) {
            console.error("Error fetching sub-types:", error);
            toast.error("Failed to load sub-categories.");
        } finally {
            setLoading(false);
        }
    };

    const fetchServicesBySubType = async (subTypeId) => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://rentease-1-pwm5.onrender.com'}/api/tenants/catalog/services-by-subtype/${subTypeId}`);
            setServices(res.data);
            setViewState('SERVICES');
        } catch (error) {
            console.error("Error fetching services by subtype:", error);
            toast.error("Failed to load services.");
        } finally {
            setLoading(false);
        }
    };

    // fetchServicesByCategory is no longer the primary entry point but kept for fallback if needed
    const fetchServicesByCategory = async (categoryId) => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'https://rentease-1-pwm5.onrender.com'}/api/tenants/catalog/category/${categoryId}/services`);
            setServices(res.data);
            setViewState('SERVICES');
        } catch (error) {
            console.error("Error fetching services by category:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        fetchTypes(category.id);
    };

    const handleTypeSelect = (type) => {
        setSelectedType(type);
        const isAC = selectedCategory?.name?.toLowerCase().includes('ac and appliance');
        if (isAC) {
            fetchSubTypes(type.id);
        } else {
            fetchServices(type.id);
        }
    };

    const handleSubTypeSelect = (subType) => {
        setSelectedSubType(subType);
        fetchServicesBySubType(subType.id);
    };

    const handleBack = () => {
        if (selectedSubType) {
            setSelectedSubType(null);
            setServices([]);
            // Don't go all the way back, just clear subtype
            return;
        }
        setViewState('CATEGORIES');
        setSelectedCategory(null);
        setSelectedType(null);
        setSelectedSubType(null);
        setServices([]);
        setTypes([]);
        setSubTypes([]);
    };

    const handleServiceClick = (service) => {
        setSelectedServiceDetails(service);
        setIsDetailsModalOpen(true);
    };

    const handleBookClick = (service) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast.info("Please login to book a service");
            navigate('/login');
            return;
        }
        setSelectedService(service);
        setIsBookingModalOpen(true);
    };

    const handleBookingConfirm = async (formData) => {
        // Ensure we send the global service ID (which is 'id' if fetching from public catalog, or 'service_id' if from provider list)
        // But for public catalog, 'id' IS the service_id.
        // The issue might be that selectedService is a provider_service object? 
        // Let's assume selectedService has 'id' as primary key of WHATEVER table it came from.
        // If it came from 'st.getServices', it's provider_services join services.
        // If it came from 'st.getCatalogServices', it's services table.

        // selectedService comes from provider_services JOIN services
        // id = service_id (from services table, due to select s.*)
        // provider_id = from provider_services
        // price = from provider_services

        const payload = {
            service_id: selectedService.id, // This is the Service ID
            provider_id: selectedService.provider_id, // This is the Provider ID
            amount: selectedService.price || selectedService.base_price,
            address: formData.address,
            contact_number: formData.contact_number,
            property_image: propertyImage,
            payment_method: formData.payment_method,
            booking_date: formData.date,
            booking_time: formData.time, // Now saves as direct 24hr string "HH:mm"
            service_type: selectedService.name || selectedService.type_name || selectedService.category_name || 'Standard', // Use specific name as priority
            priority: formData.priority || 'Normal'
        };

        const token = localStorage.getItem('accessToken');
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'https://rentease-1-pwm5.onrender.com'}/api/tenants/service-request`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Booking Request Sent Successfully!");
            setIsBookingModalOpen(false);
            setSelectedService(null);
        } catch (error) {
            console.error("Booking failed:", error);
            toast.error(error.response?.data?.error || "Booking failed. Please try again.");
        }
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'} overflow-x-hidden`}>
            <Navbar />

            {/* --- HERO SECTION --- */}
            <div className="relative pt-32 md:pt-40 pb-0 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-slate-950">
                    <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
                    <motion.div animate={{ scale: [1, 1.3, 1], x: [0, 100, 0], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl" />
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="opacity-100 transform-none">
                        <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[1.1]">
                            Your Home, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">Our Priority.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-semibold">
                            Expert repairs, cleaning, and maintenance services at your doorstep.
                        </p>
                    </div>

                    {/* Search Bar - Premium Refined Version */}
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="relative max-w-2xl mx-auto mb-4 group z-20">
                        {/* Premium Gradient Border Wrapper */}
                        <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-[22px] opacity-0 group-hover:opacity-100 transition duration-500 blur-[2px]"></div>
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-[21px] opacity-70 group-hover:opacity-100 transition duration-500"></div>

                        <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/80 rounded-[20px] p-2 shadow-2xl backdrop-blur-md transition-all duration-300">
                            <div className="pl-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"><Search className="h-6 w-6" /></div>
                            <input
                                type="text"
                                placeholder="Search for 'AC Service', 'Cleaning'..."
                                className="w-full px-4 py-4 md:py-5 bg-transparent border-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 text-lg md:text-xl font-bold outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="p-2 mr-2 text-slate-400 hover:text-indigo-500 transition-colors"
                                >
                                    <X size={22} strokeWidth={3} />
                                </button>
                            )}
                            <button className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-8 py-3.5 rounded-xl font-black text-lg transition-all transform hover:scale-[1.03] active:scale-95 shadow-xl shadow-indigo-500/25">
                                Search
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 pb-32 space-y-32">

                {viewState !== 'CATEGORIES' && (
                    <button onClick={handleBack} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white mt-8 mb-4 font-bold transition-all">
                        <ArrowLeft className="w-4 h-4" /> Back to Categories
                    </button>
                )}

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {/* CATEGORIES VIEW - GRID OF CARDS */}
                        {viewState === 'CATEGORIES' && (
                            <motion.div key="categories" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                                <div className="text-center mb-6">
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Explore our Services</h2>
                                    <div className="h-1 w-20 bg-indigo-500 mx-auto rounded-full"></div>
                                </div>
                                {categories.length === 0 ? (
                                    <div className="text-center py-10 text-slate-500 font-bold">No services available at the moment.</div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map((cat) => (
                                            <CategoryCard key={cat.id} category={cat} onClick={handleCategoryClick} />
                                        ))}
                                    </div>
                                )}

                                {/* --- FEATURED SECTION: AC & Appliance --- */}
                                {featuredServices.length > 0 && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
                                                <Zap size={32} />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">AC & Appliance Repair</h2>
                                                <p className="text-slate-500 font-bold">Expert services for your home appliances</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {featuredServices.map(service => (
                                                <ServiceListCard
                                                    key={service.id}
                                                    service={service}
                                                    onClick={() => handleServiceClick(service)}
                                                    onBook={() => handleBookClick(service)}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* SERVICES VIEW - LIST OF CARDS */}
                        {viewState === 'SERVICES' && (
                            <motion.div key="services" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                <div className="flex flex-col gap-8">
                                    {/* Header & Types */}
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 bg-slate-100">
                                                <img src={selectedCategory?.image_url} className="w-full h-full object-cover" alt={selectedCategory?.name} />
                                            </div>
                                            <div>
                                                <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-none">{selectedCategory?.name}</h2>
                                                <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold text-sm">Select a service type below</p>
                                            </div>
                                        </div>

                                        {/* Horizontal Types List */}
                                        {types.length > 0 && (
                                            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-4 px-4 scrollbar-hide">
                                                {types.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())).map((type) => (
                                                    <div
                                                        key={type.id}
                                                        onClick={() => handleTypeSelect(type)}
                                                        className={`flex-shrink-0 cursor-pointer group flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300 min-w-[120px] ${selectedType?.id === type.id
                                                            ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/25 scale-105'
                                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md'}`}
                                                    >
                                                        <div className={`w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center transition-colors ${selectedType?.id === type.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-900'}`}>
                                                            <img
                                                                src={type.image_url || "https://images.unsplash.com/photo-1581578731117-104f2a41272c?q=80&w=2670&auto=format&fit=crop"}
                                                                alt={type.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <span className={`text-xs font-bold text-center ${selectedType?.id === type.id ? 'text-white' : 'text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                                                            {type.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Services Count Banner */}
                                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
                                        <div className="flex flex-col">
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                                {selectedSubType ? selectedSubType.name : (subTypes.length > 0 ? "Select a Sub-Category" : "Available Services")}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                                                {selectedCategory?.name} {selectedType ? `> ${selectedType.name}` : ''} {selectedSubType ? `> ${selectedSubType.name}` : ''}
                                            </p>
                                        </div>
                                        <span className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white px-5 py-2.5 rounded-2xl font-black text-xs border border-slate-200 dark:border-slate-700 shadow-inner">
                                            {services.length} Services
                                        </span>
                                    </div>
                                </div>

                                {services.length === 0 && subTypes.length === 0 ? (
                                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                            <Search size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No results found</h3>
                                        <p className="text-slate-500 font-medium max-w-sm mx-auto">Try a different search term or clear the search to see all available services in {selectedCategory?.name}.</p>
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                                        >
                                            Clear Search
                                        </button>
                                    </div>
                                ) : subTypes.length > 0 && services.length === 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                                        {subTypes.filter(st => st.name.toLowerCase().includes(searchTerm.toLowerCase())).map((st) => (
                                            <div
                                                key={st.id}
                                                onClick={() => handleSubTypeSelect(st)}
                                                className="group relative overflow-hidden rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer h-72 flex flex-col"
                                            >
                                                <div className="h-44 overflow-hidden rounded-2xl mb-4 relative bg-slate-50 dark:bg-slate-950">
                                                    <img
                                                        src={st.image_url || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2669&auto=format&fit=crop"}
                                                        alt={st.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                                                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                                        <div className="flex items-center gap-1 text-[10px] font-black text-white bg-indigo-600 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                                                            Explore Now
                                                        </div>
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{st.name}</h3>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-70">Professional Repair & Care</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                                        {services.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase())).map((service) => (
                                            <ServiceListCard
                                                key={service.id}
                                                service={service}
                                                onClick={() => handleServiceClick(service)}
                                                onBook={() => handleBookClick(service)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>

            {/* Sub-Category Modal Removed - Integrated into View */}

            {/* Booking Modal */}
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                service={selectedService}
                onConfirm={handleBookingConfirm}
                initialAddress={initialAddress}
            />

            {/* Service Details Modal */}
            <ServiceDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                service={selectedServiceDetails}
                onBook={handleBookClick}
            />

            <Footer />
        </div>
    );
};

export default HomeServices;
