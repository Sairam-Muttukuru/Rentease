/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Heart,
  Filter,
  ChevronDown,
  Menu,
  X,
  Home,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Compass,
  Car,
  Calendar,
  Sofa,
  Plus,
  Mail,
  Lock,
  Star,
  CheckCircle2,
  Zap
} from 'lucide-react';
// import logo from "/favicon.png";
import Navbar from '../components/Navbar';
// --- Mock Data ---
const MOCK_PROPERTIES = [
  {
    id: 1,
    title: "Neon Horizon Apartments",
    location: "Downtown, Metro City",
    price: 2400,
    beds: 2,
    baths: 2,
    sqft: 1100,
    type: "Apartment",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1512918760532-3ad83f6f9afb?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&q=80&w=1000"
    ],
    featured: true,
    rating: 4.8,
    tags: ["Smart Home", "Gym"],
    details: { facing: "North-East", parking: "Covered", furnishing: "Furnished", year: 2023 }
  },
  {
    id: 2,
    title: "Starlight Penthouse",
    location: "Uptown, Metro City",
    price: 4500,
    beds: 3,
    baths: 3,
    sqft: 2200,
    type: "Penthouse",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1000"
    ],
    featured: true,
    rating: 5.0,
    tags: ["Pool", "View"],
    details: { facing: "South", parking: "2 Spots", furnishing: "Luxury", year: 2024 }
  },
  {
    id: 3,
    title: "Cyber Loft 2077",
    location: "Tech District, Metro City",
    price: 1800,
    beds: 1,
    baths: 1,
    sqft: 850,
    type: "Loft",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=1000"
    ],
    featured: false,
    rating: 4.5,
    tags: ["Workspace", "Fiber Net"],
    details: { facing: "West", parking: "Street", furnishing: "Semi", year: 2020 }
  },
  {
    id: 4,
    title: "Velvet Hills Villa",
    location: "Suburbs, Metro City",
    price: 3200,
    beds: 4,
    baths: 3,
    sqft: 2800,
    type: "House",
    images: [
      "https://images.unsplash.com/photo-1600596542815-2495db98dada?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000"
    ],
    featured: false,
    rating: 4.7,
    tags: ["Garden", "Garage"],
    details: { facing: "East", parking: "Garage", furnishing: "Unfurnished", year: 2019 }
  },
  {
    id: 5,
    title: "The Obsidian Studio",
    location: "Arts District, Metro City",
    price: 1500,
    beds: 1,
    baths: 1,
    sqft: 600,
    type: "Studio",
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&q=80&w=1000"
    ],
    featured: false,
    rating: 4.2,
    tags: ["Pet Friendly"],
    details: { facing: "North", parking: "None", furnishing: "Furnished", year: 2021 }
  },
  {
    id: 6,
    title: "Sapphire Lake Condo",
    location: "Waterfront, Metro City",
    price: 2900,
    beds: 2,
    baths: 2,
    sqft: 1300,
    type: "Condo",
    images: [
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1000"
    ],
    featured: true,
    rating: 4.9,
    tags: ["Waterfront", "Balcony"],
    details: { facing: "South-East", parking: "Valet", furnishing: "Luxury", year: 2022 }
  },
];

// --- Sub-Components ---

// --- Sub-Components ---
// Local Navbar removed to use global component

const PropertyCard = ({ property }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div
      className="group relative bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-white/5 transition-all duration-500 hover:shadow-[0_0_50px_rgba(139,92,246,0.15)] hover:border-violet-500/30 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Slider */}
      <div className="relative h-80 overflow-hidden">
        {property.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={property.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${index === currentImgIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/20 opacity-80" />

        {/* Navigation */}
        <div className={`absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button onClick={prevImage} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={nextImage} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110"><ChevronRight className="w-5 h-5" /></button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {property.images.map((_, idx) => (
            <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImgIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
          ))}
        </div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex gap-2">
            <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 uppercase tracking-widest hover:bg-black/60 transition-colors">
              {property.type}
            </span>
            {property.featured && (
              <span className="bg-violet-600/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                Featured
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
            ${property.price.toLocaleString()}
            <span className="text-sm font-medium text-gray-300 opacity-80">/mo</span>
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 relative">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-white leading-tight group-hover:text-violet-400 transition-colors">{property.title}</h3>
            <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg border border-yellow-500/20">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold text-yellow-500">{property.rating}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin className="w-4 h-4 text-violet-500" />
            <p className="text-sm font-medium">{property.location}</p>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 py-4 border-t border-white/5 mb-4">
          <div className="text-center p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
            <Bed className="w-5 h-5 text-gray-300 mx-auto mb-1" />
            <p className="text-xs text-gray-400">{property.beds} Beds</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
            <Bath className="w-5 h-5 text-gray-300 mx-auto mb-1" />
            <p className="text-xs text-gray-400">{property.baths} Baths</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
            <Maximize className="w-5 h-5 text-gray-300 mx-auto mb-1" />
            <p className="text-xs text-gray-400">{property.sqft} sqft</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] bg-gray-700 overflow-hidden"><img src="https://i.pravatar.cc/100?img=1" alt="" /></div>
            <div className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] bg-gray-700 overflow-hidden"><img src="https://i.pravatar.cc/100?img=2" alt="" /></div>
            <div className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] bg-gray-800 flex items-center justify-center text-[10px] text-white font-bold">+5</div>
          </div>
          <button className="text-white text-sm font-bold bg-white/10 hover:bg-violet-600 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            View <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Pages ---

const HeroSection = ({ onSearch }) => (
  <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
    {/* Background Image & Overlay */}
    <div className="absolute inset-0 z-0">
      <img
        src="https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?auto=format&fit=crop&q=80&w=2000"
        className="w-full h-full object-cover scale-105 animate-slow-pan"
        alt="City"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#050505]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
    </div>

    <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center mt-16">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-violet-300 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
        <Zap className="w-3 h-3 fill-violet-300" /> The Future of Living
      </div>

      <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight animate-fade-in-up delay-100">
        Discover your <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white">next dimension.</span>
      </h1>

      <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 font-light animate-fade-in-up delay-200">
        Experience the pinnacle of urban living with our curated collection of futuristic apartments, lofts, and penthouses.
      </p>

      {/* Floating Search Bar */}
      <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-2xl md:rounded-full shadow-2xl animate-fade-in-up delay-300">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-violet-400 transition-colors w-5 h-5" />
            <input
              type="text"
              placeholder="City, Neighborhood, or Address..."
              className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 pl-12 h-12 text-base md:text-lg"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <div className="w-px h-8 bg-white/10 hidden md:block"></div>
          <button className="w-full md:w-auto bg-violet-600 hover:bg-violet-500 text-white px-8 py-3.5 rounded-xl md:rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] flex items-center justify-center gap-2">
            Search <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-12 flex justify-center gap-8 md:gap-16 text-gray-400 animate-fade-in-up delay-500">
        <div className="text-center">
          <p className="text-3xl font-bold text-white">2.5k+</p>
          <p className="text-xs uppercase tracking-wider">Properties</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-white">850+</p>
          <p className="text-xs uppercase tracking-wider">New Listings</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-white">99%</p>
          <p className="text-xs uppercase tracking-wider">Satisfaction</p>
        </div>
      </div>
    </div>
  </div>
);

const FilterSection = ({ onFilterChange }) => (
  <div className="sticky top-20 z-30 py-4 mb-8">
    <div className="max-w-7xl mx-auto px-4">
      <div className="bg-[#121212]/80 backdrop-blur-lg border border-white/5 rounded-2xl p-2 flex flex-col md:flex-row gap-2 overflow-x-auto no-scrollbar shadow-xl">
        <div className="flex-1 flex gap-2">
          {/* Custom Select Style */}
          <div className="relative group min-w-[160px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Filter className="w-4 h-4" /></div>
            <select
              onChange={(e) => onFilterChange('price', e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-8 text-sm text-white focus:ring-1 focus:ring-violet-500 appearance-none cursor-pointer hover:bg-white/10 transition-colors"
            >
              <option value="all" className="bg-[#121212]">Price Range</option>
              <option value="0-1500" className="bg-[#121212]">Under $1,500</option>
              <option value="1500-2500" className="bg-[#121212]">$1,500 - $2,500</option>
              <option value="2500-4000" className="bg-[#121212]">$2,500 - $4,000</option>
              <option value="4000+" className="bg-[#121212]">$4,000+</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
          </div>

          <div className="relative group min-w-[160px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Home className="w-4 h-4" /></div>
            <select
              onChange={(e) => onFilterChange('type', e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-8 text-sm text-white focus:ring-1 focus:ring-violet-500 appearance-none cursor-pointer hover:bg-white/10 transition-colors"
            >
              <option value="all" className="bg-[#121212]">Property Type</option>
              <option value="Apartment" className="bg-[#121212]">Apartment</option>
              <option value="House" className="bg-[#121212]">House</option>
              <option value="Penthouse" className="bg-[#121212]">Penthouse</option>
              <option value="Loft" className="bg-[#121212]">Loft</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Quick Tags */}
        <div className="flex gap-2 items-center px-2">
          {['Pet Friendly', 'Parking', 'Pool'].map(tag => (
            <button key={tag} className="whitespace-nowrap px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm text-gray-300 hover:bg-violet-600 hover:text-white hover:border-violet-500 transition-all">
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const BrowsePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [filteredProperties, setFilteredProperties] = useState(MOCK_PROPERTIES);

  useEffect(() => {
    let result = MOCK_PROPERTIES;

    if (searchTerm) {
      result = result.filter(p =>
        p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (propertyType !== "all") {
      result = result.filter(p => p.type === propertyType);
    }

    if (priceRange !== "all") {
      if (priceRange === "0-1500") result = result.filter(p => p.price < 1500);
      if (priceRange === "1500-2500") result = result.filter(p => p.price >= 1500 && p.price <= 2500);
      if (priceRange === "2500-4000") result = result.filter(p => p.price > 2500 && p.price <= 4000);
      if (priceRange === "4000+") result = result.filter(p => p.price > 4000);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredProperties(result);
  }, [searchTerm, priceRange, propertyType]);

  const handleFilterChange = (type, value) => {
    if (type === 'price') setPriceRange(value);
    if (type === 'type') setPropertyType(value);
  };

  return (
    <div className="min-h-screen pb-20">
      <HeroSection onSearch={setSearchTerm} />

      <div className="relative z-20 -mt-20">
        <FilterSection onFilterChange={handleFilterChange} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              Featured Listings
              <span className="text-sm font-normal text-gray-500 bg-white/5 px-3 py-1 rounded-full">{filteredProperties.length} results</span>
            </h2>
            <button className="text-violet-400 hover:text-white transition-colors text-sm font-bold flex items-center gap-1">
              View Map <MapPin className="w-4 h-4" />
            </button>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white/5 rounded-[2rem] border border-white/5 border-dashed">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No properties found</h3>
              <p className="text-gray-400">Adjust your filters to find your dream home.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ListPropertyPage = () => (
  <div className="pt-32 pb-20 max-w-4xl mx-auto px-4">
    <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="text-center mb-12 relative z-10">
        <span className="text-violet-500 font-bold tracking-widest uppercase text-xs">For Landlords</span>
        <h2 className="text-4xl md:text-5xl font-black text-white mt-2 mb-4">List Your Property</h2>
        <p className="text-gray-400 text-lg">Reach millions of potential tenants with our premium listing service.</p>
      </div>

      <div className="space-y-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 ml-1">Property Title</label>
            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all focus:bg-white/10" placeholder="e.g. Sunny Downtown Loft" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400 ml-1">Monthly Rent ($)</label>
            <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all focus:bg-white/10" placeholder="2500" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Beds', 'Baths', 'Sqft', 'Year'].map((item) => (
            <div key={item} className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1">{item}</label>
              <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all focus:bg-white/10" />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-400 ml-1">Description</label>
          <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white h-40 focus:ring-2 focus:ring-violet-600 outline-none transition-all focus:bg-white/10 resize-none" placeholder="Describe the key features of your property..."></textarea>
        </div>

        <div className="pt-4">
          <button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] transition-all transform hover:-translate-y-1">
            Submit Listing
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ManageRentalsPage = () => (
  <div className="pt-32 pb-12 max-w-7xl mx-auto px-4">
    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
      <div>
        <h2 className="text-4xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-gray-400">Overview of your rental portfolio performance.</p>
      </div>
      <button className="bg-white text-black px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
        <Plus className="w-4 h-4" /> Add New Property
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {[
        { label: 'Total Revenue', value: '$14,250', sub: '+12% from last month', color: 'text-white', icon: Zap },
        { label: 'Occupancy Rate', value: '94%', sub: '3 vacancies', color: 'text-emerald-400', icon: CheckCircle2 },
        { label: 'Active Issues', value: '2', sub: 'Requires attention', color: 'text-amber-400', icon: Lock },
      ].map((stat, idx) => (
        <div key={idx} className="bg-[#0f0f0f] p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
            <stat.icon size={64} className="text-white" />
          </div>
          <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-4">{stat.label}</h3>
          <p className={`text-4xl font-black ${stat.color} mb-2`}>{stat.value}</p>
          <p className="text-sm text-gray-500">{stat.sub}</p>
        </div>
      ))}
    </div>

    <div className="bg-[#0f0f0f] rounded-[2rem] border border-white/5 overflow-hidden">
      <div className="p-8 border-b border-white/5 flex justify-between items-center">
        <h3 className="font-bold text-xl text-white">Active Listings</h3>
        <button className="text-sm text-violet-400 hover:text-white transition-colors">View All</button>
      </div>
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Home className="text-gray-500" />
        </div>
        <p className="text-gray-500">All systems operational. No alerts.</p>
      </div>
    </div>
  </div>
);

const AuthPage = ({ type }) => (
  <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative overflow-hidden">
    {/* Ambient Background */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"></div>

    <div className="w-full max-w-md bg-[#0a0a0a]/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-900/50">
          <Home className="text-white w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">{type === 'login' ? 'Welcome Back' : 'Join RentEase'}</h2>
        <p className="text-gray-400 text-sm">Enter your credentials to access the future.</p>
      </div>

      <div className="space-y-5">
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-violet-500 transition-colors" />
          <input type="email" placeholder="Email Address" className="w-full bg-[#050505] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all" />
        </div>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-violet-500 transition-colors" />
          <input type="password" placeholder="Password" className="w-full bg-[#050505] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-violet-600 outline-none transition-all" />
        </div>

        <button className="w-full bg-white text-black hover:bg-gray-200 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
          {type === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          {type === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button className="text-violet-400 font-bold hover:text-white transition-colors">
            {type === 'login' ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  </div>
);

// --- Main App ---

import { useTheme } from '../context/ThemeContext';

const App = () => {
  // eslint-disable-next-line no-unused-vars
  const [currentView, setCurrentView] = useState('browse');
  const { theme } = useTheme();

  const renderView = () => {
    switch (currentView) {
      case 'list': return <ListPropertyPage />;
      case 'manage': return <ManageRentalsPage />;
      case 'resources': return <ManageRentalsPage />; // Placeholder reuse
      case 'login': return <AuthPage type="login" />;
      case 'signup': return <AuthPage type="signup" />;
      default: return <BrowsePage />;
    }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-violet-500/30 overflow-x-hidden ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-gray-50 text-slate-900'}`}>
      {/* Global Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-[120px] mix-blend-screen"></div>
      </div>

      <Navbar />

      <main className="relative z-10">
        <BrowsePage />
      </main>

      <footer className="relative z-10 border-t border-white/5 bg-[#030303] py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <Home className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold">RentEase</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Redefining the rental experience with AI-driven matching and premium aesthetics.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Explore</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="hover:text-violet-400 cursor-pointer transition-colors">Buy Property</li>
              <li className="hover:text-violet-400 cursor-pointer transition-colors">Sell Property</li>
              <li className="hover:text-violet-400 cursor-pointer transition-colors">Rent Home</li>
              <li className="hover:text-violet-400 cursor-pointer transition-colors">Finance</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="hover:text-violet-400 cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-violet-400 cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-violet-400 cursor-pointer transition-colors">Blog</li>
              <li className="hover:text-violet-400 cursor-pointer transition-colors">Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Newsletter</h4>
            <div className="flex flex-col gap-3">
              <input type="email" placeholder="Enter email" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-violet-500 outline-none" />
              <button className="bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© 2025 RentEase Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="cursor-pointer hover:text-white">Privacy</span>
            <span className="cursor-pointer hover:text-white">Terms</span>
            <span className="cursor-pointer hover:text-white">Sitemap</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;