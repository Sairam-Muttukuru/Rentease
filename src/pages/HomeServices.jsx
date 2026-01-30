import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Search, Star, ShieldCheck, Clock, Award, ChevronRight, Zap, Droplet, Hammer, Paintbrush, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SERVICES_DATA = {
    ac: {
        title: "AC & Cooling",
        icon: Zap,
        color: "blue",
        items: [
            { name: "AC Installation", price: "₹1500", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600" },
            { name: "Deep Cleaning", price: "₹599", image: "https://images.unsplash.com/photo-1621905252507-b35a830137d3?auto=format&fit=crop&q=80&w=600" },
            { name: "Repair & Fix", price: "₹299", image: "https://plus.unsplash.com/premium_photo-1663013289069-b5860c451da7?auto=format&fit=crop&q=80&w=600" },
            { name: "Gas Refill", price: "₹2500", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=600" }
        ]
    },
    cleaning: {
        title: "Premium Cleaning",
        icon: Droplet,
        color: "emerald",
        items: [
            { name: "Full Home Spa", price: "₹2999", image: "https://images.unsplash.com/photo-1581578731117-10d52143b0d4?auto=format&fit=crop&q=80&w=600" },
            { name: "Kitchen Detox", price: "₹999", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600" },
            { name: "Sofa Shampooing", price: "₹599", image: "https://images.unsplash.com/photo-1540573133985-1153bc681b49?auto=format&fit=crop&q=80&w=600" },
            { name: "Sparkling Bathroom", price: "₹499", image: "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&q=80&w=600" },
            { name: "Weekend Weekly", price: "₹1499", image: "https://images.unsplash.com/photo-1527513984046-12475d53fdae?auto=format&fit=crop&q=80&w=600" }
        ]
    },
    repair: {
        title: "Quick Repairs",
        icon: Hammer,
        color: "amber",
        items: [
            { name: "Electrician", price: "₹199", image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80&w=600" },
            { name: "Expert Plumber", price: "₹199", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80&w=600" },
            { name: "Carpenter", price: "₹299", image: "https://images.unsplash.com/photo-1601058268499-e52642d41a3d?auto=format&fit=crop&q=80&w=600" }
        ]
    },
    interior: {
        title: "Dream Interiors",
        icon: Paintbrush,
        color: "purple",
        items: [
            { name: "Full Interiors", price: "₹1.5L", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=600" },
            { name: "Renovation", price: "₹50k", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600" }
        ]
    }
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
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

const ServiceCard = ({ item }) => (
    <motion.div
        variants={itemAnim}
        whileHover={{ y: -10, scale: 1.02 }}
        className="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border border-slate-100 dark:border-slate-700 cursor-pointer"
    >
        <div className="h-56 overflow-hidden relative">
            <motion.img
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                    {item.price}
                </span>
            </div>
        </div>
        <div className="p-6 relative">
            <h3 className="font-exited text-lg font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{item.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Wrrnty Verified
            </p>
            <motion.button
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-6 right-6 w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors"
            >
                <ArrowRight className="w-5 h-5" />
            </motion.button>
        </div>
    </motion.div>
);

const HomeServices = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'} overflow-hidden`}>
            <Navbar />

            {/* --- HERO SECTION --- */}
            <div className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Animated Background Blobs */}
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            x: [0, 100, 0],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl"
                    />
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> Rated #1 Home Services App
                        </span>

                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-tight">
                            Expert Care for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient-x">Your Dream Home</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Book trusted professionals for cleaning, repairs, and renovation.
                            <span className="font-bold text-slate-800 dark:text-white"> Instant booking. 100% Secure.</span>
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="relative max-w-2xl mx-auto mb-16 group"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-2xl">
                            <div className="pl-4 text-slate-400">
                                <Search className="h-6 w-6" />
                            </div>
                            <input
                                type="text"
                                placeholder="Try 'Sofa Cleaning' or 'AC Repair'..."
                                className="w-full px-4 py-4 md:py-5 bg-transparent border-0 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 text-lg font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105">
                                Search
                            </button>
                        </div>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-4 md:gap-8"
                    >
                        {[
                            { icon: ShieldCheck, text: "Verified Pros", color: "text-emerald-500" },
                            { icon: Clock, text: "On-Time Guarantee", color: "text-blue-500" },
                            { icon: Award, text: "5-Star Quality", color: "text-amber-500" },
                        ].map((badge, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm">
                                <badge.icon className={`w-5 h-5 ${badge.color}`} />
                                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{badge.text}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* --- SECTIONS --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32 space-y-32">
                {Object.entries(SERVICES_DATA).map(([key, category], idx) => (
                    <section key={key} className="relative">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-4 mb-10"
                        >
                            <div className={`p-4 rounded-3xl bg-${category.color}-100 dark:bg-${category.color}-900/30 text-${category.color}-600`}>
                                <category.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white">{category.title}</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Professional services at your doorstep</p>
                            </div>
                            <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700 ml-8"></div>
                        </motion.div>

                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-100px" }}
                            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${key === 'cleaning' ? '3' : key === 'repair' ? '3' : '4'} gap-8`}
                        >
                            {category.items.map((item, i) => (
                                <ServiceCard key={i} item={item} />
                            ))}
                        </motion.div>
                    </section>
                ))}
            </div>

            <Footer />
        </div>
    );
};

export default HomeServices;
