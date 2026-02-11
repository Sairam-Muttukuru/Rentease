import React from 'react';
import { Search, ArrowRight, Zap } from 'lucide-react';

const HeroSection = ({ onSearch, initialValue }) => {
    return (
        <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pb-28">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?auto=format&fit=crop&q=80&w=2000"
                    className="w-full h-full object-cover scale-105"
                    alt="City"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#050505]"></div>
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center pt-32">

                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 leading-tight animate-fade-in-up">
                    Find your space. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white">Live your dream.</span>
                </h1>

                <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8 font-light animate-fade-in-up delay-100">
                    Explore thousands of premium rental properties across the city.
                </p>

                {/* Floating Search Bar */}
                <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl md:rounded-full shadow-2xl animate-fade-in-up delay-200">
                    <div className="flex flex-col md:flex-row items-center gap-2">
                        <div className="flex-1 w-full relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-400 transition-colors w-5 h-5" />
                            <input
                                type="text"
                                defaultValue={initialValue}
                                placeholder="Search by City, Locality..."
                                className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 pl-12 h-12 text-base outline-none"
                                onChange={(e) => onSearch(e.target.value)}
                            />
                        </div>
                        {/* <div className="w-px h-8 bg-white/10 hidden md:block"></div>
            <button className="w-full md:w-auto bg-violet-600 hover:bg-violet-500 text-white px-8 py-3 rounded-xl md:rounded-full font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2">
              Search
            </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
